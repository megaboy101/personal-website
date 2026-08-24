import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { imageSize } from "image-size";

const accountId = Deno.env.get("R2_ACCOUNT_ID");
const bucket = Deno.env.get("R2_BUCKET_NAME");
const publicUrl = Deno.env.get("R2_PUBLIC_URL");

export interface Photo {
  src: string;
  width: number;
  height: number;
}

const albums = new Map<string, Photo[]>();

// Cache of previously-computed dimensions, keyed by R2 object key. Rebuilds
// reuse this instead of re-downloading every photo just to read its header,
// as long as the object's ETag hasn't changed.
const CACHE_URL = new URL("../../_cache/photography.json", import.meta.url);

interface CacheEntry {
  etag: string;
  width: number;
  height: number;
}

async function loadCache(): Promise<Record<string, CacheEntry>> {
  try {
    return JSON.parse(await Deno.readTextFile(CACHE_URL));
  } catch {
    return {};
  }
}

async function saveCache(cache: Record<string, CacheEntry>) {
  await Deno.mkdir(new URL("./", CACHE_URL), { recursive: true });
  await Deno.writeTextFile(CACHE_URL, JSON.stringify(cache));
}

// Simple concurrency limiter so we don't fire off hundreds of requests to
// R2 at once when the cache is cold.
async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return results;
}

async function fetchDimensions(
  client: S3Client,
  key: string,
): Promise<{ width: number; height: number }> {
  let lastError: unknown;

  // Most JPEGs (and PNGs/WebP/etc.) keep the marker that encodes their
  // dimensions within the first chunk of the file, even with a full EXIF
  // block attached. Start with a small range request and only fall back to
  // downloading more of the object when that isn't enough.
  const PROBE_SIZES = [64 * 1024, 512 * 1024, undefined];
  for (const size of PROBE_SIZES) {
    try {
      const response = await client.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
          Range: size ? `bytes=0-${size - 1}` : undefined,
        }),
      );
      const bytes = await response.Body!.transformToByteArray();
      const { width, height } = imageSize(bytes);
      if (width && height) return { width, height };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error(`Could not determine dimensions for ${key}`);
}

if (!accountId || !bucket || !publicUrl) {
  console.error(
    "Missing R2_ACCOUNT_ID, R2_BUCKET_NAME, or R2_PUBLIC_URL - skipping photography albums",
  );
} else {
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: {
      accessKeyId: Deno.env.get("R2_ACCESS_KEY_ID")!,
      secretAccessKey: Deno.env.get("R2_SECRET_ACCESS_KEY")!,
    },
  });

  try {
    const objects: { key: string; album: string; etag: string }[] = [];
    let continuationToken: string | undefined;

    do {
      const response = await client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          ContinuationToken: continuationToken,
        }),
      );

      for (const object of response.Contents ?? []) {
        const key = object.Key;
        if (!key) continue;

        // Keys are expected to look like "<album>/<filename>". Anything
        // sitting at the bucket root (no album folder) is skipped.
        const slashIndex = key.indexOf("/");
        if (slashIndex === -1) continue;

        objects.push({
          key,
          album: key.slice(0, slashIndex),
          etag: object.ETag ?? "",
        });
      }

      continuationToken = response.IsTruncated
        ? response.NextContinuationToken
        : undefined;
    } while (continuationToken);

    const cache = await loadCache();
    const nextCache: Record<string, CacheEntry> = {};

    const photos = await mapLimit(objects, 8, async ({ key, album, etag }) => {
      const cached = cache[key];
      let dimensions: { width: number; height: number };

      if (cached && cached.etag === etag) {
        dimensions = cached;
      } else {
        try {
          dimensions = await fetchDimensions(client, key);
        } catch (error) {
          console.error(`Error reading dimensions for ${key}:`, error);
          return null;
        }
      }

      nextCache[key] = { etag, ...dimensions };
      return { album, photo: { src: `${publicUrl}/${key}`, ...dimensions } };
    });

    for (const entry of photos) {
      if (!entry) continue;
      const list = albums.get(entry.album) ?? [];
      list.push(entry.photo);
      albums.set(entry.album, list);
    }

    await saveCache(nextCache);
  } catch (error) {
    console.error("Error listing R2 photography bucket:", error);
  }
}

export { albums };
