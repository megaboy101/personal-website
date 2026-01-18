import { Bluesky, Sun } from "./icons.tsx"

export default () => {
  return (
    <header>
      <a href="/"><img src="/img/card-gradient.jpg" alt="Profile picture" /></a>
      <h1><a href="/">Jacob Bleser</a></h1>

      <nav>
        <ul>
          <li><a href="#">Articles</a></li>
          <li><a href="#">Photography</a></li>
          <li><a href="#">Follow</a></li>
        </ul>
      </nav>
    </header>
  )
}