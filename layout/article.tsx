import { ArrowIcon, Books, HeartIcon, Leaf, Moon, Pepper, Plant, RepostIcon, Tree } from "./icons.tsx"
import { Entry } from '@/blog.ts'

export default ({ title, id, createdAt, html, properties, truncate }: Entry & { truncate?: boolean }) => {
  const type = properties?.['type']
  const development = properties?.['development']
  const manualCreatedAt = properties?.['created-time']

  const developmentIcon = 
    development === 'Seed' ? <Leaf /> :
    development === 'Budding' ? <Plant /> :
    development === 'Mature' ? <Tree /> :
    undefined
  
  const typeIcon =
    type === 'Opinion' ? <Pepper /> :
    type === 'Project' ? <Moon /> :
    type === 'Guide' ? <Books /> :
    undefined
  
  const publicCreatedAt = typeof manualCreatedAt === 'string' ? manualCreatedAt : createdAt

  return (
    <article>
      <header>
        {truncate
        ? <h1><a href={`/posts/${id}`}>{title} {developmentIcon} {typeIcon}</a></h1>
        : <h1>{title} {developmentIcon} {typeIcon}</h1>
        }
        {!truncate && <Time time={publicCreatedAt} />}
      </header>

      <div class="content" dangerouslySetInnerHTML={{ __html: truncate ? truncateHtml(html, 300) : html }}></div>

      {truncate && <a href={`/posts/${id}`} class="keep-reading">Keep Reading <ArrowIcon /></a>}

      <footer>
        {truncate && <Time time={publicCreatedAt} />}
        <button
          type="button"
          aria-pressed="false"
        >
          <RepostIcon />
        </button>
        <button
          type="button"
          aria-pressed="true"
        >
          <HeartIcon />
        </button>
      </footer>
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

function truncateHtml(str: string, limit: number) {
  const phraseClose = /<\/(h1|h2|h3|h4|p|ul|ol)>/
  const endIdx = str.slice(limit-1).search(phraseClose) + (limit-1)
  return str.slice(0, endIdx)
}
