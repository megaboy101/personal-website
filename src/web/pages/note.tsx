import { Hono } from "@hono"
import { getEntry } from "@/notebook.ts"

const page = new Hono()

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function formatDate(dateStr: string) {
  const date = new Date(dateStr)

  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

page.get("/:id", async (c) => {
  const id = c.req.param("id")

  const note = await getEntry(id)

  if (!note) {
    return c.render(
      <h1>404</h1>,
    )
  }

  return c.render(
    <main id="note">
      <article>
        <header>
          <h1>{note.title}</h1>
          <time datetime={note.createdAt}>{formatDate(note.createdAt)}</time>
        </header>

        <article-content dangerouslySetInnerHTML={{ __html: note.html }}>
        </article-content>
      </article>
    </main>,
  )
})

export default page
