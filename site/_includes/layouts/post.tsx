import { Entry } from '@/includes/types.ts'
import { BackArrow, HalfCircle } from "@/includes/icons.tsx"
import Article from "@/includes/article.tsx"

export const layout = 'page.tsx'

export default (entry: Entry) => {
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
