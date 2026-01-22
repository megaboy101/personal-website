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
    <>
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

const BackArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
  >
    <polyline
      points="80 136 32 88 80 40"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
    <path
      d="M80,200h88a56,56,0,0,0,56-56h0a56,56,0,0,0-56-56H32"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
  </svg>
)
