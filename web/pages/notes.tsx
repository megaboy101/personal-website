import { Hono } from 'hono'
import { NoteSummary, getSections } from "@/notebook.ts";

const page = new Hono()

const months = ["Jan", "Feb", "Mar", "Apr", 'May', "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function formatDate(dateStr: string) {
  const date = new Date(dateStr)

  return `${months[date.getMonth()]} ${date.getFullYear()}`
}


function NoteLink({ note }: { note: NoteSummary }) {
  return (
    <a class="flex" ui-bx="1" href={`/note/${note.id}`}>
      <article class="surface" ui-rounded ui-interactions="hover active">
        <div class="flex" ui-row ui-px="1" ui-py="2" ui-gap="4" ui-align="baseline" ui-width="full">
          <time class="text" ui-noshrink ui-size="small" ui-color="muted" ui-font="monospace" datetime={note.createdAt}>{formatDate(note.createdAt)}</time>
          <h2 class="text" ui-size="regular" ui-weight="medium" ui-underlined ui-truncated ui-interactions="visit">{note.title}</h2>
        </div>
      </article>
    </a>
  )
}


page.get("", async c => {
  const sections = await getSections()

  if (sections === null) return c.render(
    <h1 class="heading">notes</h1>
  )

  sections.forEach(section => {
    section.notes.sort((first, second) => (
      first.createdAt < second.createdAt ? 1 :
      first.createdAt > second.createdAt ? -1 :
      0
    ))
  })

  return c.render(
    <div class="flex"  ui-gap="6">
      <h1 class="heading">notes</h1>

      <div class="flex" ui-gap="6">
        {
          sections.map(section => (
            <div class="flex" ui-gap="2">
              <h2 class="heading" ui-size="mini">{section.title}</h2>

              <div>
                {
                  section.notes.map(note => (
                    <NoteLink note={note} />
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
})

export default page
