import { Hono } from 'hono'
import { getNote } from "@/notebook.ts";

const page = new Hono()

const months = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]

function formatDate(dateStr: string) {
  const date = new Date(dateStr)

  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

page.get("/:id", async c => {
  const id = c.req.param('id')

  const note = await getNote(id)

  if (!note) return c.render(
    <h1>404</h1>
  )

  return c.render(
    <article layout="py-6">
      <h1 variant="article">{note.title}</h1>

      <time variant="label" layout="pt-2" datetime={note.createdAt}>{formatDate(note.createdAt)}</time>

      <article-content layout="col pt-6 gap-5" dangerouslySetInnerHTML={{ __html: note.html }}></article-content>
    </article>
  )
})

export default page
