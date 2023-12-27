import type { PartialBlockObjectResponse, BlockObjectResponse, Heading1BlockObjectResponse, ChildPageBlockObjectResponse } from "npm:@notionhq/client/api-endpoints.d.ts";
import type { Section, NoteSummary } from '@/notebook.ts'


const isHeading = (block: BlockObjectResponse) => block["type"] === 'heading_1'
const isChildPage = (block: BlockObjectResponse) => block["type"] === 'child_page' && block['has_children']

const toSection = (heading: Heading1BlockObjectResponse): Section => ({
  title: heading.heading_1.rich_text[0].plain_text,
  notes: []
})

const toNoteSummary = (childPage: ChildPageBlockObjectResponse): NoteSummary => ({
  id: childPage.id,
  title: childPage.child_page.title,
  createdAt: childPage.created_time,
  updatedAt: childPage.last_edited_time
})

const addSummary = (section: Section, summary: NoteSummary) => ({ ...section, notes: [...section.notes, summary] })

/**
 * Converts a list of Notion blocks into a list of sections
 */
export function fromNotionBlocks(blocks: BlockObjectResponse[]) {
  return blocks.reduce((sections: Section[], block) => {
    if (isHeading(block)) {
      return [...sections, toSection(block)]
    }

    else if (isChildPage(block)) {
      const lastSection = sections.at(-1)!
      const summary = toNoteSummary(block)
      const newSection = addSummary(lastSection, summary)
      return [...sections.slice(0, -1), newSection]
    }

    else {
      return sections
    }
  }, [])
}