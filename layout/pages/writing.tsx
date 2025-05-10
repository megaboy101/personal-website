import { Entry, useCollection } from "@/blog.ts"
import Header from "../header.tsx"
import { HonoRequest } from "hono"

export const head = {
  title: 'Writing // Jacob Bleser'
}


export default ({ ctx }: { ctx: HonoRequest }) => {
  const pathSegments = ctx.path.split('/').slice(1)
  const posts = useCollection('writing')

  const guides = posts?.filter(p => p.properties?.type === 'Guide').toSorted((a, b) => {
    const aCreatedAt = typeof a.properties?.['created-time'] === 'string' ? a.properties?.['created-time'] : a.createdAt
    const bCreatedAt = typeof b.properties?.['created-time'] === 'string' ? b.properties?.['created-time'] : b.createdAt

    return aCreatedAt < bCreatedAt ? 1 : -1
  })
  const opinions = posts?.filter(p => p.properties?.type === 'Opinion').toSorted((a, b) => {
    const aCreatedAt = typeof a.properties?.['created-time'] === 'string' ? a.properties?.['created-time'] : a.createdAt
    const bCreatedAt = typeof b.properties?.['created-time'] === 'string' ? b.properties?.['created-time'] : b.createdAt

    return aCreatedAt < bCreatedAt ? 1 : -1
  })

  return (
    <main id="writing">
      <Header path={pathSegments} />

      <Category label="Guides" items={guides} />
      <Category label="Editorial" items={opinions} />
    </main>
  )
}

const Category = ({ label, items }: { label?: string, items?: Entry[] }) => (
  <section>
    <h1>{label}</h1>
    <ol>
      {
        items?.map(item => (
          <li>
            <article>
              <Time time={typeof item.properties?.['created-time'] === 'string' ? item.properties?.['created-time'] : item.createdAt} />
              <h2><a href={`/writing/${item.id}`}>{item.title}</a></h2>
            </article>
          </li>
        ))
      }
    </ol>
  </section>
)


const Time = ({ time }: { time: string }) => <time datetime={time}>{formatDate(time)}</time>

function formatDate(dateStr: string) {
  const date = new Date(dateStr)

  return `${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()}`
}
