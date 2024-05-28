import { Child } from '@hono/jsx'
import { useRequestContext } from '@hono/jsx-renderer';
import { Signature } from "@/web/templates/signature.tsx";

const LinkList = ({ children }: { children: Child }) => {
  return (
    <ul class="flex" ui-row ui-align="center">
      { !Array.isArray(children)
        ? (
          <li class="flex" ui-align="center" ui-justify="center">
            {children}
          </li>
        )
        : children.map(child => (
          <li class="flex" ui-align="center" ui-justify="center">
            {child}
          </li>
        ))
      }
    </ul>
  )
}

const Link = ({ href, children }: { href: string, children: Child }) => {
  return (
    <a
      class="text"
      ui-size="small"
      ui-color="faint"
      ui-interactions="hover current-link"
      href={href}
    >
      {children}
    </a>
  )
}

export default () => {
  return (
    <nav class="flex" ui-row ui-align="center" ui-gap="auto">
      <a href="/">
        <Signature />
      </a>

      <div class="flex" ui-row ui-align="center" ui-gap="6">
        <LinkList>
          <Link href="/notes">notes</Link>
        </LinkList>
      </div>
    </nav>
  )
}
