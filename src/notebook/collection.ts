import type {
  BlockObjectResponse,
  ChildPageBlockObjectResponse,
  Heading1BlockObjectResponse,
} from "npm:@notionhq/client/api-endpoints.d.ts"
import type { Collection, Summary } from "@/notebook.ts"

const isHeading = (block: BlockObjectResponse) => block["type"] === "heading_1"
const isChildPage = (block: BlockObjectResponse) =>
  block["type"] === "child_page" && block["has_children"]

const toCollection = (heading: Heading1BlockObjectResponse): Collection => ({
  label: heading.heading_1.rich_text[0].plain_text,
  entries: [],
})

const toSummary = (childPage: ChildPageBlockObjectResponse): Summary => ({
  id: childPage.id,
  title: childPage.child_page.title,
  createdAt: childPage.created_time,
  updatedAt: childPage.last_edited_time,
})

const addSummary = (collection: Collection, summary: Summary): Collection => ({
  ...collection,
  entries: [...collection.entries, summary],
})

/**
 * Converts a list of Notion blocks into a list of collections
 */
export function fromNotionBlocks(blocks: BlockObjectResponse[]) {
  return blocks.reduce((collections: Collection[], block) => {
    if (isHeading(block)) {
      return [...collections, toCollection(block)]
    } else if (isChildPage(block)) {
      const lastCollection = collections.at(-1)!
      const summary = toSummary(block)
      const newCollection = addSummary(lastCollection, summary)
      return [...collections.slice(0, -1), newCollection]
    } else {
      return collections
    }
  }, [])
}
