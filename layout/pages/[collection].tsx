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

function NoteLink({ note }: { note: Record<string, any> }) {
  return (
    <article>
      <h3>
        <a href={`/notes/${note.id}`}>
          {note.title}
        </a>
      </h3>
      <time datetime={note.createdAt}>{formatDate(note.createdAt)}</time>
    </article>
  )
}

export default ({ collection }) => {
  if (collection.length === 0) {
    return (
      <h1>notes</h1>
    )
  }

  return (
    <main id="notes">
      <h1>notes</h1>
      <section>
        {collection.map((entry) => (
            <NoteLink note={entry} />
        ))}
      </section>
    </main>
  )
}
