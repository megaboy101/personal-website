import { Entry } from '@/includes/types.ts'
import { BackArrow, HalfCircle } from "@/includes/icons.tsx"

export const layout = 'page.tsx'

export default (entry: Entry & {content?: unknown}) => {
  return (
    <>
      <nav>
        <button id="theme-toggle" type="button">
          <HalfCircle />
        </button>
      </nav>
      <aside>
        <a href="/">
          <BackArrow />
          index
        </a>
      </aside>
      <main id="entry">
        <Article {...entry} />
      </main>
    </>
  )
}

const Article = ({ title, createdAt, html, properties, content, children }: Entry & {content?: unknown}) => {
  const manualCreatedAt = properties?.['created-time']
  const publicCreatedAt = typeof manualCreatedAt === 'string' ? manualCreatedAt : createdAt

  return (
    <article>
      <header>
        <h1>{title}</h1>
        <Time time={publicCreatedAt} />
      </header>

      {html ? (
        <div
          class="content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div class="content">{children}</div>
      )}
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
