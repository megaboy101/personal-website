import { Hono } from 'hono'
import type { FC } from 'hono/jsx'

const page = new Hono()



type LinkedPage = "discord home" | "discord personal" | "marriage pact" | "github" | "twitter" | "linkedin" | "resume" | "digital garden"

type LinkData = {
  url: string,
  color: string
}

const links: { readonly [k in LinkedPage]: LinkData } = {
  'discord home': {
    url: "https://discord.com/",
    color: "var(--color-discord)",
  },
  'marriage pact': {
    url: "https://marriagepact.com/",
    color: "var(--color-marriagepact)",
  },
  'digital garden': {
    url: "https://maggieappleton.com/garden-history",
    color: "rgb(4, 164, 186)",
  },
  'discord personal': {
    url: "https://discordapp.com/users/318894685714120706",
    color: "var(--color-discord)",
  },
  'github': {
    url: "https://github.com/megaboy101",
    color: "var(--color-github)",
  },
  'twitter': {
    url: "https://twitter.com/jacobbleser",
    color: "var(--color-twitter)",
  },
  'linkedin': {
    url: "https://www.linkedin.com/in/jacobbleser/",
    color: "var(--color-linkedin)",
  },
  'resume': {
    url: "https://docs.google.com/document/d/1WGUI6Ib-jkLDm7kzfFZwINk2x1Wi3TQjopYROJYNbAk/edit?usp=sharing",
    color: "var(--color-google-docs)",
  },
}

type LinkProps = {
  to: LinkedPage
}

const Link: FC<LinkProps> = ({ to, children }) => {
  return (
    <a
      class="text"
      ui-weight="medium"
      ui-underlined
      href={links[to].url}
      style={`color:${links[to].color};border-color:${links[to].color}`}
    >
      {children}
    </a>
  )
}

function Divider() {
  return (
    <div class="flex" ui-row ui-gap="6" ui-justify="center">
      <Dot />
      <Dot />
      <Dot />
    </div>
  )
}

function Dot() {
  return (
    <div style="
      background:var(--neutral-9);
      border-radius:100px;
      width:3px;
      height:3px
    "></div>
  )
}


page.get("", c => {
  return c.render(
    <div class="flex" ui-gap="5">
      <h1 class="heading">
        👋 Hi, I'm Jacob
      </h1>

      <div class="flex" ui-gap="8">
        <p class="prose">
          I build apps and games for the web.
          <br/><br/>
          Right now I work as a product engineer at <Link to="discord home">Discord</Link>, and before that I was an early engineer at a social dating startup called <Link to="marriage pact">The Marriage Pact</Link>.
          <br/><br/>
          I currently live in Brooklyn, New York
        </p>

        <Divider />

        <p class="prose">
          🌱 This is my <Link to="digital garden">digital garden</Link>, where I collect my thoughts, experiences, and doodles.
          <br/><br/>
          ❗️ Not everything here is polished or complete, but that's the beauty of it. Life, much like software, is perpetually under construction.
        </p>

        <div class="flex" ui-gap="3">
          <h2 class="heading" ui-size="mini">Connect with me</h2>

          <div class="flex" ui-row ui-wrap ui-gap="3">
            <Link to="discord home">Discord</Link>
            <Link to="twitter">Twitter</Link>
            <Link to="github">Github</Link>
            <Link to="linkedin">LinkedIn</Link>
            <Link to="resume">Resume</Link>
          </div>
        </div>
      </div>
    </div>
  )
})

export default page
