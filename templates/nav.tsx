import { FC } from 'hono/jsx'
import { useRequestContext } from 'hono/middleware';

const LinkList: FC = ({ children }) => {
  return (
    <ul class="row center">
      {
        children.map(child => (
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

export default () => (
  <nav>
    <class-group target="a" trigger="hover" active="color-neutral-12" layout="row center gap-auto">
      <a variant="signature" href="/">
        Jacob Bleser
      </a>

      <div layout="row center gap-6">
        <LinkList>
          <Link href="/projects">projects</Link>
          <Link href="/notes">notes</Link>
          <Link href="/cool-stuff">cool stuff</Link>
          <Link href="/doodles">doodles</Link>
        </LinkList>

        <nav-divider></nav-divider>
      </div>
    </class-group>
  </nav>
)