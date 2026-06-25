import { SiteData } from "./index.page.tsx"

export const metas = {
  title: '=title',
  author: 'Jacob Bleser',
  site: 'Jacob\'s Blog',
  lang: 'en',
  type: 'article',
  image: 'https://jacobb.nyc/img/card-gradient.jpg',
}

export const layout = 'layouts/post.tsx'

export default function*({ obsidian }: SiteData) {
  if (obsidian == null) return

  for (const entry of obsidian) {
    yield {
      ...entry,
      url: `/writing/${entry.id}`,
      title: `${entry.title} // Jacob Bleser`,
      metas,
      layout,
    }
  }
}
