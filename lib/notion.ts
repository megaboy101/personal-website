import { Client } from "@notionhq/client"
import { NotionToMarkdown } from "notion-to-md"
import type { BlockObjectResponse } from "@notionhq/client/api-endpoints.d.ts"
import markdownit from "markdown-it"
import hljs from "highlight.js"
import { throttled } from "@/notion/throttle.ts"

const notion = client()
const md = new NotionToMarkdown({ notionClient: notion })
const html = markdownit({
  highlight(str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(str, { language: lang }).value
    }

    return ""
  },
})

/**
 * Get a list of content blocks for a Notion page
 */
export async function getPage(pageId: string) {
  const response = await throttled(async () =>
    await notion.blocks.children.list({ block_id: pageId })
  )

  return response.results.filter((b): b is BlockObjectResponse => "type" in b)
}

/**
 * Get the raw HTML content of a Notion page
 */
export async function getPageHtml(pageId: string) {
  const blocks = await getPage(pageId)
  const mdBlocks = await md.blocksToMarkdown(blocks)
  const mdStr = md.toMarkdownString(mdBlocks)
  const htmlStr: string = html.render(mdStr.parent)

  return htmlStr
}

function client() {
  const API_TOKEN = Deno.env.get("NOTION_API_TOKEN")

  if (API_TOKEN == null) {
    throw new Error(
      "Could not find required environment variable: [NOTION_API_TOKEN]",
    )
  }

  return new Client({ auth: API_TOKEN })
}
