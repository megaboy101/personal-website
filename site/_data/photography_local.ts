import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

const accountId = Deno.env.get("R2_ACCOUNT_ID");
const bucket = Deno.env.get("R2_BUCKET_NAME");
const publicUrl = Deno.env.get("R2_PUBLIC_URL");

const albums = new Map<string, string[]>();

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

        const album = key.slice(0, slashIndex);
        const photos = albums.get(album) ?? [];
        photos.push(`${publicUrl}/${key}`);
        albums.set(album, photos);
      }

      continuationToken = response.IsTruncated
        ? response.NextContinuationToken
        : undefined;
    } while (continuationToken);
  } catch (error) {
    console.error("Error listing R2 photography bucket:", error);
  }
}

export { albums };
