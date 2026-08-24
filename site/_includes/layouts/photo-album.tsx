import { HalfCircle } from "@/includes/icons.tsx"
import { Photo } from "../../_data/photography.ts"

export const title = 'Photo Album'
export const metas = {
  title: '=title',
  author: 'Jacob Bleser',
  description:
    "20-something product engineer living in Brooklyn, NY. Currently working at Discord",
  site: 'Jacob\'s Blog',
  lang: 'en',
  type: 'website',
  image: 'https://jacobb.nyc/img/card-gradient.jpg',
}

export const layout = 'page.tsx'

const EAGER_LOAD_IMG_COUNT = 1;

export default ({title, pics: photos}: {title: string, pics: Photo[]}) => {
  const track1 = 0
  const track2 = Math.floor(((photos.length ?? 0) / 3))
  const track3 = Math.floor(((photos.length ?? 0) / 3) * 2)

  return (
    <>
      <BasicNav title={title} />
      <main id="photos">
        <div class="track">
          {photos.slice(track1, track2).map((photo, idx) => (
            <img src={photo.src} width={photo.width} height={photo.height} alt="" loading={idx < EAGER_LOAD_IMG_COUNT ? "eager" : "lazy"} />
          ))}
        </div>
        <div class="track">
          {photos.slice(track2, track3).map((photo, idx) => (
            <img src={photo.src} width={photo.width} height={photo.height} alt="" loading={idx < EAGER_LOAD_IMG_COUNT ? "eager" : "lazy"} />
          ))}
        </div>
        <div class="track">
          {photos.slice(track3).map((photo, idx) => (
            <img src={photo.src} width={photo.width} height={photo.height} alt="" loading={idx < EAGER_LOAD_IMG_COUNT ? "eager" : "lazy"} />
          ))}
        </div>
      </main>
    </>
  );
};

function BasicNav({title}: {title: string}) {
  return (
    <nav>
      <a href="/"><img id="pfp-deco" src="/img/cat.png" alt="" /></a>

      <span>{title}</span>

      <button id="theme-toggle" type="button">
        <HalfCircle />
      </button>
    </nav>
  )
}
