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
                  <a class="page" href={`/note/${note.id}`}>
                    <span>{note.title}</span>
                    <span>{formatDate(note.createdAt)}</span>
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