import { Hono } from '@hono'
import { NoteSummary, getSections } from "@/notebook.ts";

const page = new Hono()

const months = ["Jan", "Feb", "Mar", "Apr", 'May', "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function formatDate(dateStr: string) {
  const date = new Date(dateStr)

  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

function NoteLink({ note }: { note: NoteSummary }) {
  return (
    <article>
        <h3>
          <a href={`/note/${note.id}`}>
            {note.title}
          </a>
        </h3>
        <time datetime={note.createdAt}>{formatDate(note.createdAt)}</time>
    </article>
  )
}


page.get("", async c => {
  const sections = await getSections()

  if (sections === null) return c.render(
    <h1>notes</h1>
  )

  sections.forEach(section => {
    section.notes.sort((first, second) => (
      first.createdAt < second.createdAt ? 1 :
      first.createdAt > second.createdAt ? -1 :
      0
    ))
  })

  return c.render(
    <main id="notes">
      <h1>notes</h1>
      {
        sections.map(section => (
          <section>
            <h2>{section.title}</h2>

            {
              section.notes.map(note => (
                <NoteLink note={note} />
              ))
            }
          </section>
        ))
      }
    </main>
  )
})

export default page
