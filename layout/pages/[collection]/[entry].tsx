import { Entry } from "@/blog.ts"
import Article from "../../article.tsx"

export const head = ({ entry }: { entry: Entry }) => ({
  title: entry.title
})

export default ({ entry }: { entry: Entry }) => {

  return (
    <main id="entry">
      <Article {...entry} />
    </main>
  )
}
