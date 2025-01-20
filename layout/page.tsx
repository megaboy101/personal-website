import { Child } from "hono/jsx"
import { useRequestContext } from "hono/jsx-renderer"
import { Signature } from "./icons.tsx"

export default ({ children }: { children?: Child }) => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Skypack URL that's pinned for faster file resolution */}
      <script
        type="module"
        async
        src="https://cdn.skypack.dev/pin/@hotwired/turbo@v7.3.0-44BiCcz1UaBhgMf1MCRj/mode=imports,min/optimized/@hotwired/turbo.js"
      >
      </script>

      <script type="module" async src="/scripts/insights.js"></script>

      <link rel="stylesheet" href="/styles/style.css" />

      <link rel="shortcut icon" type="image/jpg" href="/favicon.png" />

      <title>{'My blog'}</title>
    </head>

    <Layout>
      {children}
    </Layout>
  </html>
)

const Layout = ({ children }: { children: Child }) => (
  <body>
    <Header />

    {children}

    <Footer />
  </body>
)

const Header = () => (
  <header>
    <nav>
      <Link href="/">
        <Signature />
      </Link>

      <ul>
        <li>
          <Link href={`/notes`}>/notes</Link>
        </li>
      </ul>
    </nav>
  </header>
)

function Link({ href, children }: { href: string; children: Child }) {
  const c = useRequestContext()
  const currentPath = c.req.path === href

  return (
    <a href={href} {...(currentPath ? { "aria-current": "page" } : null)}>
      {children}
    </a>
  )
}

const Footer = () => (
  <footer>
    <small>Made in Brooklyn</small>
    <small>Built with Deno, Hono, and Lit</small>
  </footer>
)
