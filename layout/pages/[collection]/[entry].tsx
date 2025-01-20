export default ({ entry }) => {

  return (
    <main id="note">
      <article>
        <header>
          <h1>{entry?.title}</h1>
          <time datetime={entry?.createdAt}>{formatDate(entry?.createdAt)}</time>
        </header>

        <article-content dangerouslySetInnerHTML={{ __html: entry?.html }}></article-content>
      </article>
    </main>
  )
}

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