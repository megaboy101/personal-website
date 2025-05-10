import { Child } from "hono/jsx"
import { useRequestContext } from "hono/jsx-renderer"

export default ({ children }: { children?: Child }) => {
  const ctx = useRequestContext()
  const head = ctx.get('head')
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <script type="module" async src="/scripts/cursor-tracker.js"></script>
        <script type="module" async src="/scripts/insights.js"></script>
        <script type="module" async src="/scripts/light-dark.js"></script>

        <link rel="stylesheet" href="/styles/style.css" />

        <link rel="icon" href="/favicon.ico" />

        <title>{head?.title ?? 'Jacob Bleser'}</title>
      </head>

      <Layout>
        {children}
      </Layout>
    </html>
  )
}

const Layout = ({ children }: { children: Child }) => (
  <body>
    {children}
  </body>
)
