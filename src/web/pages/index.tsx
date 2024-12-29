import { Hono } from "hono"
import type { Child } from "hono/jsx"

const page = new Hono()

const links = {
  "discord home": "https://discord.com/",
  "marriage pact": "https://marriagepact.com/",
  "digital garden": "https://maggieappleton.com/garden-history",
  "discord personal": "https://discordapp.com/users/318894685714120706",
  "github": "https://github.com/megaboy101",
  "twitter": "https://twitter.com/jacobbleser",
  "linkedin": "https://www.linkedin.com/in/jacobbleser/",
  "resume":
    "https://docs.google.com/document/d/1WGUI6Ib-jkLDm7kzfFZwINk2x1Wi3TQjopYROJYNbAk/edit?usp=sharing",
}

type LinkProps = {
  to: keyof (typeof links)
  children: Child
}

const Link = ({ to, children }: LinkProps) => {
  return (
    <a href={links[to]}>
      {children}
    </a>
  )
}

function Divider() {
  return (
    <jb-divider>
      <template shadowrootmode="open">
        <div part="dot" />
        <div part="dot" />
        <div part="dot" />
      </template>
    </jb-divider>
  )
}

page.get("", (c) => {
  return c.render(
    <main id="index">
      <h1>👋 Hi, I'm Jacob</h1>

      <p>I build apps and games for the web.</p>
      <p>
        Right now I work as a product engineer at{" "}
        <Link to="discord home">Discord</Link>, and before that I was an early
        engineer at a social dating startup called{" "}
        <Link to="marriage pact">The Marriage Pact</Link>.
      </p>
      <p>I currently live in Brooklyn, New York</p>

      <Divider />

      <p>
        🌱 This is my{" "}
        <Link to="digital garden">digital garden</Link>, where I collect my
        thoughts, experiences, and doodles.
      </p>
      <p>
        ❗️ Not everything here is polished or complete, but that's the beauty of
        it. Life, much like software, is perpetually under construction.
      </p>

      <h2>Connect with me</h2>

      <address>
        <Link to="discord home">Discord</Link>
        <Link to="twitter">Twitter</Link>
        <Link to="github">Github</Link>
        <Link to="linkedin">LinkedIn</Link>
        <Link to="resume">Resume</Link>
      </address>
    </main>,
  )
})

export default page
