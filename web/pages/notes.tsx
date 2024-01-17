import { Hono } from 'hono'
import { getSections } from "@/notebook.ts";

const page = new Hono()

const months = ["Jan", "Feb", "Mar", "Apr", 'May', "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function formatDate(dateStr: string) {
  const date = new Date(dateStr)

  return `${months[date.getMonth()]} ${date.getFullYear()}`
}


page.get("", async c => {
  const sections = await getSections()

  if (sections === null) return c.render(
    <div layout="py-8">
      <h1>notes</h1>
    </div>
  )

  sections.forEach(section => {
    section.notes.sort((first, second) => (
      first.createdAt < second.createdAt ? 1 :
      first.createdAt > second.createdAt ? -1 :
      0
    ))
  })

  return c.render(
    <div layout="py-8">
      <h1>notes</h1>

      <div layout="col pt-6 gap-6">
        {
          sections.map(section => (
            <div>
              <h2 layout="pb-2">{section.title}</h2>

              {
                section.notes.map(note => (
                  <a
                    variant="surface"
                    layout="row gap-4 px-1 py-2 left baseline"
                    style="
                      transition: background-color 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                    "
                    href={`/note/${note.id}`}>
                    <span variant="date">{formatDate(note.createdAt)}</span>
                    <span variant="note-link">{note.title}</span>
                  </a>
                ))
              }
            </div>
          ))
        }
      </div>
    </div>
  )
})

export default page
