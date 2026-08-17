import { HalfCircle } from "@/includes/icons.tsx"

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

export default ({pics: photos}: {pics: string[]}) => {
  const track1 = 0
  const track2 = Math.floor(((photos.length ?? 0) / 3))
  const track3 = Math.floor(((photos.length ?? 0) / 3) * 2)

  return (
    <>
      <BasicNav />
      <main id="photos">
        <div class="track">
          {photos.slice(track1, track2).map(photo => (
            <img src={photo} alt="" />
          ))}
        </div>
        <div class="track">
          {photos.slice(track2, track3).map(photo => (
            <img src={photo} alt="" />
          ))}
        </div>
        <div class="track">
          {photos.slice(track3).map(photo => (
            <img src={photo} alt="" />
          ))}
        </div>
      </main>
    </>
  );
};

function BasicNav() {
  return (
    <nav>
      <img id="pfp-deco" src="/img/cat.png" alt="" />

      <button id="theme-toggle" type="button">
        <HalfCircle />
      </button>
    </nav>
  )
}
