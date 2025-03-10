import type { Child } from "hono/jsx"
import { Collection, Entry, useCollection } from "@/blog.ts"
import Article from "../article.tsx"
import { Bluesky, Github, LinkedIn, Signature } from "../icons.tsx"
import { ArrowIcon } from "../icons.tsx"


// MARK: Profile Card

const ProfileCard = () => (
  <cursor-tracker id="profile-card">
    <div class="inner">
      <svg role="none" class="banner">
        <mask id="pfp-mask">
          <rect></rect>
          <circle></circle>
        </mask>
        <foreignObject mask="url(#pfp-mask)">
          <img src="/img/banner.jpg" alt="" />
        </foreignObject>
      </svg>

      <img class="pfp" src="/img/pfp.jpeg" alt="" />

      <div class="content">
        <Signature id="signature" aria-label="Jacob Bleser" />

        <dl class="follows">
          <div>
            <dt>following</dt>
            <dd>44</dd>
          </div>

          <div>
            <dt>followers</dt>
            <dd>33</dd>
          </div>
        </dl>

        <div class="bio">
          <p><em>Wussup, choom? You need somethin'?</em></p>
          <br></br>
          <p>📍 Brooklyn, NY</p>
          <p>💼 Product Engineer @ Discord</p>
          <p>🧗 rock climber</p>
          <p>🐉 DnD & Cyberpunk DM</p>
        </div>

        <ul className="socials">
          <li>
            <a href="https://github.com/megaboy101" aria-label="Github">
              <Github />

              megaboy101

              <ArrowIcon />
            </a>
          </li>
          <li>
            <a href="https://bsky.app/profile/jacobb.nyc" aria-label="Bluesky">
              <Bluesky />

              jacobb.nyc

              <ArrowIcon />
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/jacobbleser/" aria-label="Linkedin">
              <LinkedIn />

              Jacob Bleser

              <ArrowIcon />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </cursor-tracker>
)

// MARK: Article Menu

const FilterBtn = ({ label, children, active }: { label: string, children: Child, active?: boolean }) => (
  <button
    type="button"
    id={`filter-${label}`}
    aria-pressed={active}
    tabIndex="0"
  >
    {children}
  </button>
)

const ArticleMenu = () => (
  <div role="group" aria-label="Filter content">
    <FilterBtn label="all" active>
      all
    </FilterBtn>
    <FilterBtn label="posts">
      posts
    </FilterBtn>
  </div>
)

// MARK: Article List

function createdAtOrder(first: Entry, second: Entry) {
  const firstCreatedAt = first.properties?.['created-time'] ?? first.createdAt
  const secondCreatedAt = second.properties?.['created-time'] ?? second.createdAt

  return (
    firstCreatedAt < secondCreatedAt ? 1
    : firstCreatedAt > secondCreatedAt ? -1
    : 0
  )
}

const ArticleList = ({ posts }: { posts?: Collection }) => {
  const sortedPosts = posts?.toSorted(createdAtOrder) ?? []

  return (
    <ol id="content-list">
      {sortedPosts.map(post => (
        <li><Article {...post} truncate /></li>
      ))}
    </ol>
  )
}

// MARK: Page

export const head = {
  title: 'Jacob Bleser'
}

export default () => {
  const posts = useCollection('posts')

  return (
    <main id="index">
      <aside>
        <ProfileCard />
      </aside>

      <div>
        <ArticleMenu />

        <ArticleList posts={posts} />
      </div>
    </main>
  )
}
