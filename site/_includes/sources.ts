import { mapKeys } from "@std/collections"
import * as gDrive from "@googleapis/drive"
import { unified } from "unified"
import shiki from "@shikijs/rehype"
import stringify from "rehype-stringify"
import frontmatter from "remark-frontmatter"
import github from "remark-gfm"
import parse from "remark-parse"
import rehype from "remark-rehype"
import obsidian from "remark-obsidian"
import { matter } from "vfile-matter"
import slugify from "slugify"
import { walk } from "@std/fs"

class Markdown {
  #htmlBuilder = unified()
    .use(parse)
    .use(frontmatter)
    .use(obsidian, {
      titleToUrl: (link) => `/posts/${slugify(link, { lower: true })}`,
    })
    .use(() => (_tree, file) => matter(file))
    .use(github)
    .use(rehype, { allowDangerousHtml: true })
    .use(shiki, {
      themes: {
        light: "one-light",
        dark: "vitesse-dark",
      },
    })
    .use(stringify, { allowDangerousHtml: true })

  #folder: string

  constructor(folder: string = ".") {
    this.#folder = folder
  }

  async *entries() {
    for await (const entry of walk(this.#folder, { exts: ["md"] })) {
      if (!entry.isFile) continue
      const content = await Deno.readTextFile(entry.path)
      const meta = await Deno.stat(entry.path)

      const html = await this.#htmlBuilder.process(content)
      const properties = mapKeys(
        html.data.matter,
        (k) => slugify(k, { lower: true }),
      )
      const title = entry.name.replace(/\.[^/.]+$/, "")
      const id = slugify(title, { lower: true })

      yield {
        id,
        title,
        createdAt: meta.mtime?.toISOString(),
        updatedAt: meta.birthtime?.toISOString(),
        html: html.toString(),
        properties,
      }
    }
  }
}

export function markdown(opts: any) {
  return new Markdown(opts)
}

class Photos {
  constructor(url?: string) {
    if (!url) throw new Error("Missing photos URL")

    this.url = url
  }

  async *entries() {
    const response = await fetch(this.url)
    const html = await response.text()

    for (const url of this.#toPhotoUrls(html)) {
      yield url
    }
  }

  #toPhotoUrls(html: string): Set<string> {
    const regex =
      /\["(https:\/\/lh3\.googleusercontent\.com\/pw\/[a-zA-Z0-9\-_]*)"/g // the only difference is the [ at the beginning

    const links = new Set()
    let match
    while ((match = regex.exec(html))) {
      links.add(match[1])
    }
    return links
  }
}

export function photos(url?: string) {
  return new Photos(url)
}

class Json {
  #filepath: string

  constructor(filepath: string) {
    this.#filepath = filepath
  }

  async *entries() {
    const text = await Deno.readTextFile(this.#filepath)
    const data = JSON.parse(text)

    for (const entry of data) {
      yield entry
    }
  }
}

export function json(opts: any) {
  return new Json(opts)
}

class Drive {
  #scopes = ["https://www.googleapis.com/auth/drive.readonly"]
  #fileId: string
  #client: gDrive.drive_v3.Drive
  #decoder = new TextDecoder()
  #htmlBuilder = unified()
    .use(parse)
    .use(frontmatter)
    .use(obsidian, {
      titleToUrl: (link) => `/posts/${slugify(link, { lower: true })}`,
    })
    .use(() => (_tree, file) => matter(file))
    .use(github)
    .use(rehype, { allowDangerousHtml: true })
    .use(shiki, {
      themes: {
        light: "one-light",
        dark: "vitesse-dark",
      },
    })
    .use(stringify, { allowDangerousHtml: true })

  constructor({ fileId, keyFile }: { fileId: string; keyFile: object }) {
    this.#fileId = fileId
    this.#client = gDrive.drive({
      version: "v3",
      auth: new gDrive.auth.GoogleAuth({ keyFile, scopes: this.#scopes }),
    })
  }

  async *entries() {
    for await (const [meta, content] of this.#downloadAll(this.#fileId)) {
      const file = await this.#htmlBuilder.process(content)
      const properties = mapKeys(
        file.data.matter,
        (k) => slugify(k, { lower: true }),
      )
      const title = meta.name.replace(/\.[^/.]+$/, "")
      const id = slugify(title, { lower: true })
      yield {
        id,
        // Exclude file extension when presenting the file name as a title
        title,
        createdAt: meta.createdTime,
        updatedAt: meta.modifiedTime,
        html: file.toString(),
        properties,
      }
    }
  }

  async *entriesRaw() {
    for await (const [meta, content] of this.#downloadAll(this.#fileId)) {
      yield {
        title: meta.name.replace(/\.[^/.]+$/, ""),
        createdAt: meta.createdTime,
        updatedAt: meta.modifiedTime,
        md: content,
      }
    }
  }

  async #list(id: string) {
    // This is a simple sample script for retrieving the file list.
    const response = await this.#client.files.list({
      pageSize: 100,
      q: `'${id}' in parents and trashed = false`,
      fields: "files(id, name, mimeType, createdTime, modifiedTime)",
    })

    return response.data.files ?? []
  }

  async #download(id: string): Promise<string | undefined> {
    try {
      const res = await this.#client.files.get(
        { fileId: id, alt: "media" },
        { responseType: "arraybuffer" },
      )

      const content = this.#decoder.decode(new Uint8Array(res.data))
      return content
    } catch (error) {
      console.error(`Error downloading file with id: ${id}:`, error)
    }
  }

  async *#downloadAll(id: string) {
    const files = await this.#list(id)

    for (const file of files) {
      if (!file.id) continue
      if (file.mimeType === "application/vnd.google-apps.folder") {
        // It's a folder, recurse
        yield* this.#downloadAll(file.id)
      } else {
        // It's a file, download it
        const download = await this.#download(file.id)
        yield [file, download]
      }
    }
  }
}

export function drive(opts: any) {
  return new Drive(opts)
}
