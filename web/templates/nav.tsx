import { FC } from 'hono/jsx'
import { useRequestContext } from 'hono/middleware';
import { Signature } from "@/web/templates/signature.tsx";

const LinkList: FC = ({ children }) => {
  return (
    <ul class="row center">
      { !Array.isArray(children)
        ? <li layout="box">{children}</li>
        : children.map(child => (
          <li layout="box">
            {child}
          </li>
        ))
      }
    </ul>
  )
}

const Link: FC<{href: string}> = ({ href, children }) => {
  const ctx = useRequestContext()

  const currentRoute = ctx.req.path === href;

  return (
    <a
      variant="muted"
      class={currentRoute ? 'color-neutral-12' : ''}
      cg-default={currentRoute ? true : null}
      href={href}
      layout="pl-5"
    >
      {children}
    </a>
  )
}

export default () => {
  return (
    <nav>
      <class-group target=":where(a, svg)" trigger="hover" active="color-neutral-12" layout="row center gap-auto">
        <a href="/">
          <Signature />
        </a>

        <div layout="row center gap-6">
          <LinkList>
            <Link href="/notes">notes</Link>
          </LinkList>

          {/* <nav-divider></nav-divider> */}
        </div>
      </class-group>
    </nav>
  )
}