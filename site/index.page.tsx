import { Entry } from "@/includes/types.ts";
import { HalfCircle, Image } from "@/includes/icons.tsx";
import { Photo } from "./_data/photography.ts";

export const title = 'Jacob Bleser'
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

export const layout = "page.tsx";

const ALBUM_LIMIT = 3;

export interface SiteData extends Lume.Data {
  photography: {albums: Map<string, Photo[]>}
}

export default ({photography}: SiteData) => {
  return (
    <>
      <nav>
        <button id="theme-toggle" type="button">
          <HalfCircle />
        </button>
      </nav>
      <main id="index">
        <figure id="profile">
          <img
            id="pfp"
            src="/img/pfp.jpg"
            alt="Jacob Bleser"
          />
          <img id="pfp-deco" src="/img/cat.png" alt="" />
        </figure>

        <p>
          Hey, I'm Jacob&ensp;ʕっ•ᴥ•ʔっ♥
          <br />
          <br />
          I'm a product engineer at Discord
          <br />
          I work on <a href="https://discord.com/ads/quests">Quests</a>, <a href="https://support.discord.com/hc/en-us/articles/30593690165783-Discord-Orbs-FAQ">Orbs</a>, and the <a href="https://support.discord.com/hc/en-us/articles/17162747936663-Shop-FAQ">Shop</a>
          <br />
          <br />
          I write about web and game programming, and also do photography
        </p>

        <Directory
          albums={photography.albums}
        />

        <div id="photos">
          {photography.albums.entries().find(([name]) => name === 'japan-highlights-2026')?.[1].map((pic, idx) => (
            <img
              src={pic.src}
              width={pic.width}
              height={pic.height}
              alt=""
              // Lazy load images beneath the fold
              // Images are really big on the index page, so only a single
              // image will realistically be in frame at the start
              loading={idx === 0 ? "eager" : "lazy"} />
          ))}
        </div>
      </main>
    </>
  );
};

function Directory({albums}: {albums: Map<string, Photo[]>}) {
  return (
    <ol>
      {albums.entries().take(ALBUM_LIMIT).map(([title, items]) => (
        <li>
          <a href={`/photos/${title}`}>
            <Image />
            <span class="item">{title}</span>
            <div></div>
            <span class="item-detail">{items.length} photos</span>
          </a>
        </li>
      )).toArray()}
      {/*{articles.toSorted(sortCreatedTime)?.slice(0, ARTICLE_LIMIT)?.entries().map(([idx, article]) => (
        <li>
          <a href={`/writing/${idx}`}>
            <Article />
            <span>{article.title}</span>
            <div></div>
            <Time
              time={
                typeof article.properties?.[
                  "created-time"
                ] === "string"
                  ? article.properties?.["created-time"]
                  : article.createdAt
              }
            />
          </a>
        </li>
      )).toArray()}*/}
    </ol>
  )
}

export const Time = ({ time }: { time: string }) => (
  <time pubdate datetime={time}>
    {formatDate(time)}
  </time>
);

function formatDate(dateStr: string) {
  const date = new Date(dateStr);

  return `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}-${date.getFullYear()}`;
}

function sortCreatedTime(first: Entry, second: Entry) {
  const firstCreatedAt =
    typeof first.properties?.["created-time"] === "string"
      ? first.properties?.["created-time"]
      : first.createdAt;
  const secondCreatedAt =
    typeof second.properties?.["created-time"] === "string"
      ? second.properties?.["created-time"]
      : second.createdAt;

  return firstCreatedAt < secondCreatedAt ? 1 : -1;
}
