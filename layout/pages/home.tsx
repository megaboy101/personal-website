import Header from "../header.tsx";
import { useCollection } from "@/blog.ts";
import { Category, Time, usePosts } from "./writing.tsx";

export const head = {
  title: "Jacob Bleser",
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
  const { opinions } = usePosts()
  const photos = usePhotos();

  return (
    <main id="home">
      <div id="profile" class="animated" style="--i:0">
        <img id="pfp" src="/img/pfp.jpg" alt="Jacob Bleser" />
        <img id="pfp-deco" src="/img/cat.png" alt="" />

        <hgroup>
          <h1>Jacob Bleser</h1>
          <h2><a href="https://bsky.app/profile/jacobb.nyc">@jacobb.nyc</a></h2>
        </hgroup>
      </div>

      <div class="animated" style="--i:1">
        <p>
          Product Engineer at Discord, writing about web development, creativity, ADHD, and Cyberpunk
        </p>
        <p>
          Living in Brooklyn NY with Katherine and Miles
        </p>
      </div>

      <ol class="animated" style="--i:2">
        {
          opinions?.slice(0, 7)?.map((post) => (
            <li>
              <a href={`/writing/${post.id}`}>
                <Time time={post.properties['created-time'] ?? post.createdAt} />
                <div></div>
                <span>{post.title}</span>
              </a>
            </li>
          ))
        }
      </ol>

      <div id="photos" class="animated" style="--i:3">
        <div>
          {
            photos.slice(0, Math.floor(photos.length / 2)).map(pic => (
              <img src={pic} alt="" />
            ))
          }
        </div>
        <div>
          {
            photos.slice(Math.ceil(photos.length / 2)).map(pic => (
              <img src={pic} alt="" />
            ))
          }
        </div>
      </div>
    </main>
  );
};

function usePhotos(): string[] {
  const photos = useCollection("photos");

  return photos ?? [];
}
