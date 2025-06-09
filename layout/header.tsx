import { Bluesky, Dots, Email, Github, LinkedIn, Sun } from "./icons.tsx"

export default () => {
  return (
    <header>
      <div class="profile">
        <a href="/"><img src="/img/card-gradient.jpg" alt="Profile picture" /></a>
        <h1><a href="/">Jacob Bleser</a></h1>
        {/* <address>
          <a href="mailto:bleserjacob@gmail.com"><Email /></a>
          <a href="https://bsky.app/profile/jacobb.nyc"><Bluesky /></a>
          <a href="https://github.com/megaboy101"><Github /></a>
          <a href="https://linkedin.com/in/jacobbleser"><LinkedIn /></a>
        </address> */}
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