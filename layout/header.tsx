import { Bluesky, Dots, Email, Github, LinkedIn, Sun } from "./icons.tsx"

export default () => {
  return (
    <header>
      <div class="profile">
        <a href="/"><img src="/img/pfp.jpg" alt="Profile picture" /></a>
        <a href="/">Jacob Bleser</a>
        <div>
          <a href="mailto:bleserjacob@gmail.com"><Email /></a>
          <a href="https://bsky.app/profile/jacobb.nyc"><Bluesky /></a>
          <a href="https://github.com/megaboy101"><Github /></a>
          <a href="https://linkedin.com/in/jacobbleser"><LinkedIn /></a>
        </div>
      </div>

      {/* <nav>
        <a href="/writing">writing</a>
        <a href="/photos">photos</a>
        <a href="/doodles">doodles</a>
        <a href="/cool-stuff">cool stuff</a>
      </nav> */}
  
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