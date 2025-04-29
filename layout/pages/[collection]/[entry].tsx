import { Entry } from "@/blog.ts"
import Article from "../../article.tsx"
import Header from "../../header.tsx"
import { HonoRequest } from "hono"

export const head = ({ entry }: { entry: Entry }) => ({
  title: `Jacob Bleser // ${entry.title}`
})

export default ({ entry, ctx }: { entry: Entry, ctx: HonoRequest }) => {
  const pathSegments = ctx.path.split('/').slice(1)

  return (
    <main id="entry">
      <Header path={pathSegments} />
      <Article {...entry} />
    </main>
  )
}
