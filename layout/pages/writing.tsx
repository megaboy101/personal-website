import { Entry, useCollection } from "@/blog.ts"
import Header from "../header.tsx"
import { HonoRequest } from "hono"
import { Arrow } from "../icons.tsx"

export const head = {
  title: 'Writing // Jacob Bleser'
}


export default ({ ctx }: { ctx: HonoRequest }) => {
  const {guides, opinions} = usePosts()

  return (
    <main id="writing">
      <Category label="Guides" items={guides} />
      <Category label="Editorial" items={opinions} />
    </main>
  )
}

export const Category = ({ label, items, limit }: { label?: string, items?: Entry[], limit?: number }) => (
  <section>
    <header>
      <h1>{label}</h1>
      {limit && <a href="/writing">see all <Arrow /></a>}
    </header>
    <ol>
      {
        items?.filter((_, idx) => !limit || idx < limit)?.map(item => (
          <li>
            <Time time={typeof item.properties?.['created-time'] === 'string' ? item.properties?.['created-time'] : item.createdAt} />
            <h2><a href={`/writing/${item.id}`}>{item.title}</a></h2>
          </li>
        ))
      }
    </ol>
  </section>
)


export const Time = ({ time }: { time: string }) => <time pubdate datetime={time}>{formatDate(time)}</time>

function formatDate(dateStr: string) {
  const date = new Date(dateStr)

  return `${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()}`
}

export function usePosts() {
  const posts = useCollection('writing')
  
  const guides = posts?.filter(p => p.properties?.type === 'Guide').toSorted(sortCreatedTime)
  const opinions = posts?.filter(p => p.properties?.type === 'Opinion').toSorted(sortCreatedTime)

  return { guides, opinions }
}

function sortCreatedTime(first: Entry, second: Entry) {
  const firstCreatedAt = typeof first.properties?.['created-time'] === 'string' ? first.properties?.['created-time'] : first.createdAt
  const secondCreatedAt = typeof second.properties?.['created-time'] === 'string' ? second.properties?.['created-time'] : second.createdAt

  return firstCreatedAt < secondCreatedAt ? 1 : -1
}
