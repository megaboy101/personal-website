import { Hono } from '@hono'
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
    <h1 class="heading">404</h1>
  )

  return c.render(
    <article class="flex"  ui-py="6">
      <div class="flex"  ui-gap="6">
        <div class="flex"  ui-gap="2">
          <h1 class="heading">{note.title}</h1>
          <time class="text" ui-size="small" ui-color="muted" datetime={note.createdAt}>{formatDate(note.createdAt)}</time>
        </div>

        <div class="article-content" dangerouslySetInnerHTML={{ __html: note.html }}></div>
      </div>
    </article>
  )
})

export default page
