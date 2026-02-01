import { Entry } from "@/blog.ts"
import Article from "../../article.tsx"
import { HonoRequest } from "hono"
import { BackArrow, HalfCircle } from "../../icons.tsx"

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

export default ({ entry }: { entry: Entry, ctx: HonoRequest }) => {
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
