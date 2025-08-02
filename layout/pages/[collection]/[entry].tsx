import { Entry } from "@/blog.ts"
import Article from "../../article.tsx"
import Header from "../../header.tsx"
import { HonoRequest } from "hono"

export const head = ({ entry }: { entry: Entry }) => ({
  title: `${entry.title} // Jacob Bleser`,
  author: 'Jacob Bleser',
  opengraph: {
    type: 'article',
    title: entry.title,
    url: `https://jacobb.nyc/${entry.id}`,
    image: 'https://jacobb.nyc/img/card-gradient.jpg',
    author: 'Jacob Bleser'
  },
  twitter: {
    title: entry.title,
    site: 'jacobbleser',
    image: 'https://jacobb.nyc/img/card-gradient.jpg'
  }
})

export default ({ entry, ctx }: { entry: Entry, ctx: HonoRequest }) => {
  const pathSegments = ctx.path.split('/').slice(1)

  return (
    <main id="entry">
      <Article {...entry} />
    </main>
  )
}
