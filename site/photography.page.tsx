import { BackArrow, Caret, HalfCircle } from "@/includes/icons.tsx"
import { SiteData } from "./index.page.tsx"

export const title = 'Photography'
export const metas = {
  title: '=title',
  author: 'Jacob Bleser',
  description:
    "20-something product engineer living in Brooklyn, NY. Currently working at Discord",
  site: 'Jacob\'s Blog',
  lang: 'en',
  type: 'profile',
  image: 'https://jacobb.nyc/img/card-gradient.jpg',
}

export const layout = 'page.tsx'

export default ({photos}: SiteData) => {
  return (
    <>
      <nav>
        <a href="/">
          <BackArrow />
        </a>
        <button id="album" type="button" popovertarget="album-list">
          Favorites
          <Caret />
        </button>
        <button id="theme-toggle" type="button">
          <HalfCircle />
        </button>
        <div id="album-list" popover="auto">
          <div class="header">Albums</div>
          <ul>
            <li>Favorites <span>70</span></li>
            <li>Italy 2025 <span>23</span></li>
            <li>Miles <span>84</span></li>
          </ul>
        </div>
      </nav>
      <main id="photos">
        {photos?.map(photo => (
          <img src={photo} alt="" />
        ))}
      </main>
    </>
  );
};
