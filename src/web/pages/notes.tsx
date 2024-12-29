import { Hono } from "hono"
import { getCollections, Summary } from "@/notebook.ts"

const page = new Hono()

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

function formatDate(dateStr: string) {
  const date = new Date(dateStr)

  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

function NoteLink({ note }: { note: Summary }) {
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

page.get("", async (c) => {
  const collections = await getCollections()

  if (collections === null) {
    return c.render(
      <h1>notes</h1>,
    )
  }

  collections.forEach((c) => {
    c.entries.sort((first, second) => (
      first.createdAt < second.createdAt
        ? 1
        : first.createdAt > second.createdAt
        ? -1
        : 0
    ))
  })

  return c.render(
    <main id="notes">
      <h1>notes</h1>
      {collections.map((c) => (
        <section>
          <h2>{c.label}</h2>

          {c.entries.map((entry) => <NoteLink note={entry} />)}
        </section>
      ))}
    </main>,
  )
})

export default page
