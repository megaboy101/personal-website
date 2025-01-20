import markdownit from "markdown-it"
import hljs from "highlight.js"
import { throttle } from "@/blog/utils.ts"
import { Client } from "@notionhq/client"
import { NotionToMarkdown } from "notion-to-md"

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

