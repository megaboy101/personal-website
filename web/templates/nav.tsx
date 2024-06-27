import { Signature } from "@/web/templates/signature.tsx";
import { Child } from '@hono/jsx'
import { useRequestContext } from "@hono/jsx-renderer";


function Link({ href, children }: { href: string; children: Child }) {
  const c = useRequestContext()
  const currentPath = c.req.path === href

  return (
    <a href={href} {...(currentPath ? { 'aria-current': 'page' } : null)}>{children}</a>
  )
}

export default () => {
  return (
    <header>
      <nav>
        <Link href="/">
          <Signature />
        </Link>

        <ul>
          <li><Link href="/notes">notes</Link></li>
        </ul>
      </nav>
    </header>
  )
}
