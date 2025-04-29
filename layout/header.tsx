import { Dots, Sun } from "./icons.tsx"

export default ({ path }: { path: string[] }) => {
  const fullPath = ['@me', ...path]
  return (
    <header>
      <nav>
        <ol>
          {fullPath.map((segment, idx) => (
            <>
              <li>
                <a href={`/${path.slice(0, idx).join('/')}`} aria-current={idx === fullPath.length-1 ? 'page' : undefined}>{segment}</a>
              </li>
              {idx !== fullPath.length-1 && <span> / </span>}
            </>
          ))}
        </ol>
      </nav>
  
      <div class="settings" role="group">
        <button type="button" aria-pressed="false">
          <Dots />
        </button>
        <button id="theme-toggle" type="button" aria-pressed="false">
          <Sun />
        </button>
      </div>
    </header>
  )
}