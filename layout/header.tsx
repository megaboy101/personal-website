import { Bluesky, Sun } from "./icons.tsx"

export default () => {
  return (
    <header>
      <div class="profile">
        <a href="/"><img src="/img/card-gradient.jpg" alt="Profile picture" /></a>
        <h1><a href="/">Jacob Bleser</a></h1>
      </div>

      <div class="settings" role="group">
        <a id="bluesky" type="button" href="https://bsky.app/profile/jacobb.nyc">
          <Bluesky /> 37
        </a>
        <button id="theme-toggle" type="button">
          <Sun />
        </button>
      </div>
    </header>
  )
}