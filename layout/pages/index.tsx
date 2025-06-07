import { Bluesky, Camera, Github, Link, LinkedIn, Sparkle, Writing } from "../icons.tsx"
import Header from "../header.tsx"
import { Entry, useCollection } from "@/blog.ts"
import { Category, usePosts } from "./writing.tsx"

export const head = {
  title: 'Jacob Bleser',
  author: 'Jacob Bleser',
  description: '20-something product engineer living in Brooklyn, NY. Currently working at Discord',
  opengraph: {
    type: 'profile',
    title: 'Jacob Bleser',
    url: 'https://jacobb.nyc',
    image: 'https://jacobb.nyc/img/card-gradient.jpg',
    description: '20-something product engineer living in Brooklyn, NY. Currently working at Discord',
    site_name: 'Jacob Bleser'
  },
  twitter: {
    title: 'Jacob Bleser',
    site: 'jacobbleser',
    description: '20-something product engineer living in Brooklyn, NY. Currently working at Discord',
    image: 'https://jacobb.nyc/img/card-gradient.jpg'
  }
}

export default () => {
  const posts = usePosts()

  return (
    <main id="index">
      <Header />

      <section id="welcome">
        <header>
          <span>🏕️</span>
          <h1>welcome to my ~space~</h1>
        </header>

        <p>
          Fiancé // writer // photographer // product engineer at Discord
        </p>
        <br />
        <p>
          Collecting thoughts and musings on browser tech, ADHD, Dungeons and Dragons, startup culture, gaming, and social media.
        </p>
        <br />
        <p>
          Most reachable via email or Discord. I don't check LinkedIn
        </p>
        <br />
        <p>
          Living with Kat and Miles in Brooklyn, NY
        </p>
      </section>

      {Object.entries(posts).map(([section, entries]) => (
        <Category label={section} items={entries} limit={5} />
      ))}
    </main>
  )
}
