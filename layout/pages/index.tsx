import { Entry, useCollection } from "@/blog.ts";

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
    <main id="index">
      <figure id="profile" class="animated" style="--i:0">
        <img id="pfp" src="/img/pfp.jpg" alt="Jacob Bleser" />
        <img id="pfp-deco" src="/img/cat.png" alt="" />

        <figcaption>
          <span>Jacob Bleser</span>
          <span><a href="https://bsky.app/profile/jacobb.nyc">@jacobb.nyc</a></span>
        </figcaption>
      </figure>

      <p class="animated" style="--i:1">
        Product Engineer at Discord, writing about web development, creativity, ADHD, and Cyberpunk
        <br /><br />
        Living in Brooklyn NY with Katherine and Miles
      </p>

      <ol class="animated" style="--i:2">
        {
          opinions?.slice(0, 7)?.map((post) => (
            <li>
              <a href={`/writing/${post.id}`}>
                <Time time={typeof post.properties?.['created-time'] === 'string' ? post.properties?.['created-time'] : post.createdAt} />
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

export const Time = ({ time }: { time: string }) => <time pubdate datetime={time}>{formatDate(time)}</time>

function formatDate(dateStr: string) {
  const date = new Date(dateStr)

  return `${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()}`
}

function usePhotos(): string[] {
  const photos = useCollection("photos");

  return photos ?? [];
}

export function usePosts() {
  const posts = useCollection('writing')
  
  const guides = posts?.filter(p => p.properties?.type === 'Guide').toSorted(sortCreatedTime)
  const opinions = posts?.filter(p => p.properties?.type === 'Opinion').toSorted(sortCreatedTime)

  return { guides, opinions }
}

function sortCreatedTime(first: Entry, second: Entry) {
  const firstCreatedAt = typeof first.properties?.['created-time'] === 'string' ? first.properties?.['created-time'] : first.createdAt
  const secondCreatedAt = typeof second.properties?.['created-time'] === 'string' ? second.properties?.['created-time'] : second.createdAt

  return firstCreatedAt < secondCreatedAt ? 1 : -1
}
