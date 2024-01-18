import { Hono } from 'hono'

const page = new Hono()

page.get("", c => {
  return c.render(
    <div>
      <h1 variant="small" layout="pb-5">
        👋 Hi, I'm Jacob
      </h1>

      <p>
        I build apps and games for the web.
        <br/><br/>
        Right now I work as a product engineer at <a href="https://discord.com/" style="color:var(--color-discord);border-color:var(--color-discord)">Discord</a>, and before that I was an early engineer at a social dating startup called <a href="https://marriagepact.com/" style="color:var(--color-marriagepact);border-color:var(--color-marriagepact)">The Marriage Pact</a>.
        <br/><br/>
        I currently live in Brooklyn, New York
      </p>

      <div layout="row gap-6 py-8 middle">
        <div style="background:var(--neutral-9);border-radius:100px;width:3px;height:3px"></div>
        <div style="background:var(--neutral-9);border-radius:100px;width:3px;height:3px"></div>
        <div style="background:var(--neutral-9);border-radius:100px;width:3px;height:3px"></div>
      </div>

      <p>
        🌱 This is my <a href="https://maggieappleton.com/garden-history" style="color:rgb(4, 164, 186);font-weight:500;border-bottom:1px solid rgb(4, 164, 186)">digital garden</a>, where I collect my thoughts, experiences, and doodles.
        <br/><br/>
        ❗️ Not everything here is polished or complete, but that's the beauty of it. Life, much like software, is perpetually under construction.
      </p>

      <h2 variant="small" layout="pt-8 pb-2">Connect with me</h2>

      <div layout="row wrap gap-3">
        <a href="https://discordapp.com/users/318894685714120706" style="color:var(--color-discord);border-color:var(--color-discord)">Discord</a>
        <a href="https://twitter.com/jacobbleser" style="color:var(--color-twitter);border-color:var(--color-twitter)">Twitter</a>
        <a href="https://github.com/megaboy101" style="color:var(--color-github);border-color:var(--color-github)">Github</a>
        <a href="https://www.linkedin.com/in/jacobbleser/" style="color:var(--color-linkedin);border-color:var(--color-linkedin)">LinkedIn</a>
        <a href="https://docs.google.com/document/d/1WGUI6Ib-jkLDm7kzfFZwINk2x1Wi3TQjopYROJYNbAk/edit?usp=sharing" style="color:var(--color-google-docs);border-color:var(--color-google-docs)">Resume</a>
      </div>
    </div>
  )
})

export default page
