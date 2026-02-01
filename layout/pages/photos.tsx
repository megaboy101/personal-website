import { BackArrow, Caret, HalfCircle } from "../icons.tsx"
import { usePhotos } from "./index.tsx"

export const head = {
  title: "Jacob Bleser // Photography",
  author: "Jacob Bleser",
  description:
    "20-something product engineer living in Brooklyn, NY. Currently working at Discord",
  opengraph: {
    type: "profile",
    title: "Jacob Bleser",
    url: "https://jacobb.nyc",
    image: "https://jacobb.nyc/img/card-gradient.jpg",
    description:
      "20-something product engineer living in Brooklyn, NY. Currently working at Discord",
    site_name: "Jacob Bleser",
  },
  twitter: {
    title: "Jacob Bleser",
    site: "jacobbleser",
    description:
      "20-something product engineer living in Brooklyn, NY. Currently working at Discord",
    image: "https://jacobb.nyc/img/card-gradient.jpg",
  },
};

export default () => {
  const photos = usePhotos();

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
        {photos.map(photo => (
          <img src={photo} alt="" />
        ))}
      </main>
    </>
  );
};