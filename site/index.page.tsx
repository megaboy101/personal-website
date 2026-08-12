import { Entry } from "@/includes/types.ts";
import { HalfCircle } from "@/includes/icons.tsx";

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

const ARTICLE_LIMIT = 7;

export interface SiteData extends Lume.Data {
  obsidian?: Entry[]
  photos?: string[]
}

export default ({obsidian, photos}: SiteData) => {
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

        <ol>
          {obsidian?.toSorted(sortCreatedTime)?.slice(0, ARTICLE_LIMIT)?.map((article) => (
            <li>
              <a href={`/writing/${article.id}`}>
                <Time
                  time={
                    typeof article.properties?.[
                      "created-time"
                    ] === "string"
                      ? article.properties?.["created-time"]
                      : article.createdAt
                  }
                />
                <div></div>
                <span>{article.title}</span>
              </a>
            </li>
          ))}
        </ol>

        <div id="photos">
          <div>
            {photos
              ?.slice(0, Math.floor(photos.length / 2))
              .map((pic) => (
                <img src={pic} alt="" />
              ))}
          </div>
          <div>
            {photos
              ?.slice(Math.ceil(photos.length / 2))
              .map((pic) => (
                <img src={pic} alt="" />
              ))}
          </div>
        </div>
      </main>
    </>
  );
};

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
