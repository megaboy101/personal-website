import { Entry } from '@/blog.ts'

export default ({ title, createdAt, html, properties }: Entry) => {
  const manualCreatedAt = properties?.['created-time']

  const publicCreatedAt = typeof manualCreatedAt === 'string' ? manualCreatedAt : createdAt

  return (
    <article>
      <header>
        <h1>{title}</h1>
        <Time time={publicCreatedAt} />
      </header>

      <div class="content" dangerouslySetInnerHTML={{ __html: html }}></div>
    </article>
  )
}

const Time = ({ time }: { time: string }) => <time datetime={time}>{formatDate(time)}</time>

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
