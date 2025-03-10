import markdownit from "markdown-it"
import hljs from "highlight.js"
import { throttle } from "@/blog/utils.ts"
import { mapKeys } from "@std/collections"
import { Client } from "@notionhq/client"
import { NotionToMarkdown } from "notion-to-md"
import * as gDrive from "@googleapis/drive"
import { unified } from "unified"
import shiki from "@shikijs/rehype"
import stringify from "rehype-stringify"
import frontmatter from "remark-frontmatter"
import github from "remark-gfm"
import parse from "remark-parse"
import rehype from "remark-rehype"
import obsidian from 'remark-obsidian'
import { matter } from "vfile-matter"
import slugify from 'slugify'

class Markdown {
  #html = markdownit({
    highlight(str: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(str, { language: lang }).value
      }
  
      return ""
    },
  })

  #folder?: string

  constructor(folder: string) {
    this.#folder = folder
  }

  async *entries(): AsyncGenerator<[string, string], void, unknown> {
    for await (const entry of Deno.readDir(this.#folder ?? './content')) {
      const file = await Deno.readTextFile(`${Deno.cwd()}/${this.#folder}/${entry.name}`)

      const html = this.#html.render(file)
      // collection[entry.name.split('.')[0]] = html
      yield [entry.name.split('.')[0], html]
    }
  }
}

export function markdown(opts: any) {
  return new Markdown(opts)
}


class Notion {
  #id: string
  #client: Client

  constructor({ id, token: auth }: { id: string, token: string }) {
    this.#id = id
    this.#client = new Client({ auth })
  }

  async *entries() {
    const entryBlocks = await this.database(this.#id)

    for (const entryBlock of entryBlocks) {
      const pageHtml = await this.pageHtml(entryBlock?.id)
      yield {
        id: entryBlock.id,
        title: selectTitle(entryBlock),
        createdAt: entryBlock.created_time,
        updatedAt: entryBlock.last_edited_time,
        html: pageHtml
      }
    }
  }

  @throttle(333)
  async page(pageId: string): Promise<any[]> {
    const response = await this.#client.blocks.children.list({ block_id: pageId })
    return response.results
  }

  async pageHtml(pageId: string) {
    const md = new NotionToMarkdown({ notionClient: this.#client })
    const html = markdownit({
      highlight(str: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(str, { language: lang }).value
        }

        return ""
      },
    })

    const blocks = await this.page(pageId)
    const mdBlocks = await md.blocksToMarkdown(blocks)
    const mdStr = md.toMarkdownString(mdBlocks)
    const htmlStr = html.render(mdStr?.parent ?? '')
    return htmlStr
  }

  @throttle(333)
  async database(databaseId: string): Promise<any[]> {
    const response = await this.#client.databases.query({
      database_id: databaseId
    })

    return response.results
  }
}

function selectTitle(pageBlock: { [key:string]: any }): string | undefined {
  const titleProperty = Object.values<any>(pageBlock.properties).find(p => p?.type === 'title')
  const titleText = titleProperty?.title?.at(0)?.text?.content

  if (!titleText) return undefined

  return titleText
}

export function notion(opts: any) {
  return new Notion(opts)
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
  .use(obsidian, { titleToUrl: (link) => `/posts/${slugify(link, { lower: true })}` })
  .use(() => (_tree, file) => matter(file))
  .use(github)
  .use(rehype, { allowDangerousHtml: true })
  .use(shiki, {
    themes: {
      light: 'one-light',
      dark: 'one-dark-pro',
    }
  })
  .use(stringify, { allowDangerousHtml: true })

  constructor({fileId, keyFile}: {fileId: string, keyFile: object}) {
    this.#fileId = fileId
    this.#client = gDrive.drive({
      version: "v3",
      auth: new gDrive.auth.GoogleAuth({keyFile, scopes: this.#scopes })
    });
  }

  async *entries() {
    for await (const [meta, content] of this.#downloadAll(this.#fileId)) {
      const file = await this.#htmlBuilder.process(content)
      const properties = mapKeys(file.data.matter, k => slugify(k, { lower: true }))
      const title = meta.name.replace(/\.[^/.]+$/, "")
      const id = slugify(title, { lower: true })
      yield {
        id,
        // Exclude file extension when presenting the file name as a title
        title,
        createdAt: meta.createdTime,
        updatedAt: meta.modifiedTime,
        html: file.toString(),
        properties
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
        { responseType: "arraybuffer" }
      );

      const content = this.#decoder.decode(new Uint8Array(res.data))
      return content
    } catch (error) {
      console.error(`Error downloading file with id: ${id}:`, error);
    }
  }

  async *#downloadAll(id: string) {
    const files = await this.#list(id);

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