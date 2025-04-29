import { Bluesky, Camera, Github, Link, LinkedIn, Sparkle, Writing } from "../icons.tsx"
import Header from "../header.tsx"

export const head = {
  title: 'Jacob Bleser'
}

export default () => {
  return (
    <main id="index">
      <Header path={[]} />

      <cursor-tracker class="card">
        <h1>Jacob Bleser</h1>
        <div role="group" class="social">
          <a href="https://github.com/megaboy101"><Github /></a>
          <a href="https://bsky.app/profile/jacobb.nyc"><Bluesky /></a>
          <a href="https://linkedin.com/in/jacobbleser"><LinkedIn /></a>
        </div>

        <dl>
          <dt>Location</dt>
          <dd><a href="https://maps.app.goo.gl/hR68MSbcZ6oShAqc7">Brooklyn, NY</a></dd>
          <dt>Occupation</dt>
          <dd><a href="https://leerob.com/n/product-engineers">Product Engineer</a></dd>
          <dt>Company</dt>
          <dd><a href="https://youtu.be/hX9MOVIMYkg?si=cu0lSZh9iiPKZpEs">Discord</a></dd>
        </dl>
      </cursor-tracker>

      <div class="sub-card">
        <div class="links sub-card" role="group">
          <a href="/writing"><Writing /> Writing</a>
          <a href="/photography"><Camera /> Photos</a>
          <a href="/doodles"><Sparkle /> Doodles</a>
          <a href="/links"><Link /> Links</a>
        </div>
      </div>
    </main>
  )
}
