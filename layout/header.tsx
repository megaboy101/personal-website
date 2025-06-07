import { Bluesky, Dots, Email, Github, LinkedIn, Sun } from "./icons.tsx"

export default () => {
  return (
    <header>
      <div class="profile">
        <a href="/"><img src="/img/pfp.jpg" alt="Profile picture" /></a>
        <h1><a href="/">Jacob Bleser</a></h1>
        <address>
          <a href="mailto:bleserjacob@gmail.com"><Email /></a>
          <a href="https://bsky.app/profile/jacobb.nyc"><Bluesky /></a>
          <a href="https://github.com/megaboy101"><Github /></a>
          <a href="https://linkedin.com/in/jacobbleser"><LinkedIn /></a>
        </address>
      </div>

      <div class="settings" role="group">
        <button id="theme-toggle" type="button" aria-pressed="false">
          <Sun />
        </button>
      </div>
    </header>
  )
}