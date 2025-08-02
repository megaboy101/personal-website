import { Child } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { Arrow, Bluesky, Github, LinkedIn, Sun } from "./icons.tsx";
import { usePosts } from "./pages/writing.tsx";

export default ({ children }: { children?: Child }) => {
  const ctx = useRequestContext();
  const head = ctx.get("head");

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />

        {/* Basic metadata */}
        <title>{head?.title ?? "Jacob Bleser"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {head?.author && <meta name="author" content={head.author} />}
        {head?.description && (
          <meta name="description" content={head.description} />
        )}

        {/* Opengraph tags */}
        {head?.opengraph && <Opengraph {...head.opengraph} />}

        {/* Twitter card tags */}
        {head?.opengraph && <Twitter {...head.twitter} />}

        {/* Scripts */}
        <script type="module" async src="/scripts/cursor-tracker.js"></script>
        <script type="module" async src="/scripts/insights.js"></script>
        <script type="module" async src="/scripts/light-dark.js"></script>
        <script type="module" async src="/scripts/select-link.js"></script>

        {/* Stylesheets */}
        <link rel="stylesheet" href="/styles/style.css" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>

      <Layout>{children}</Layout>
    </html>
  );
};

const Layout = ({ children }: { children: Child }) => (
  <body>
    <Header />
    {children}
  </body>
);

const Header = () => {
  const { guides, opinions } = usePosts();
  const ctx = useRequestContext();
  const pathname = ctx.req.path;

  return (
    <header>
      <div id="self">
        <h1>
          <a href="/">Jacob Bleser</a>
        </h1>

        <nav>
          <select-link>
            <select>
              <option value="/" selected={pathname === "/" || undefined}>
                Jacob Bleser
              </option>
              <option
                value="/writing"
                selected={pathname === "/writing" || undefined}
              >
                Posts
              </option>
            </select>
          </select-link>
        </nav>

        <div role="group" id="mobile-social">
          <a href="https://bsky.app/profile/jacobb.nyc">
            <Bluesky />
          </a>

          <button id="theme-toggle" type="button">
            <Sun />
          </button>
        </div>

        <p>
          Fiance, writer, photographer, product engineer at Discord
          <br />
          <br />
          Web dev, ADHD, Dungeons and Dragons, tech culture, gaming, and social
          media.
          <br />
          <br />
          Living in Brooklyn
        </p>

        <div role="group">
          <a href="https://bsky.app/profile/jacobb.nyc">
            <Bluesky />
          </a>

          <a href="https://github.com/megaboy101">
            <Github />
          </a>

          <a href="https://linkedin.com/in/jacobbleser">
            <LinkedIn />
          </a>

          <button id="theme-toggle" type="button">
            <Sun />
          </button>
        </div>
      </div>

      <Squiggle />

      <div>
        <h1>
          <a href="https://bsky.app/profile/jacobb.nyc">
            Now <Arrow />
          </a>
        </h1>
        <p>
          Obsessing over personal sites with the aesthetics of social media
          pages
          <br />
          <br />
          muan.co
        </p>
      </div>

      <Squiggle />

      <div id="posts">
        <h1>
          <a href="/writing">
            Posts <Arrow />
          </a>
        </h1>

        <ol>
          {opinions?.slice(0, 5).map((post) => (
            <li>
              <a href={"/writing/" + post.id}>{post.title}</a>
            </li>
          ))}
        </ol>
      </div>

      {/* <div>
        <Bookshelf />
      </div> */}
    </header>
  );
};

const Squiggle = () => {
  return (
    <svg
      id="wiggle"
      class="icon"
      width="215"
      height="8"
      viewBox="0 0 215 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 7L4.55 2.5C6.36037 0.205166 9.83963 0.205165 11.65 2.5V2.5C13.4604 4.79484 16.9396 4.79483 18.75 2.5V2.5C20.5604 0.205165 24.0396 0.205165 25.85 2.5V2.5C27.6604 4.79484 31.1396 4.79483 32.95 2.5V2.5C34.7604 0.205165 38.2396 0.205166 40.05 2.5V2.5C41.8604 4.79483 45.3396 4.79484 47.15 2.5V2.5C48.9604 0.205166 52.4396 0.205165 54.25 2.5V2.5C56.0604 4.79484 59.5396 4.79484 61.35 2.5V2.5C63.1604 0.205165 66.6396 0.205165 68.45 2.5V2.5C70.2604 4.79484 73.7396 4.79483 75.55 2.5V2.5C77.3604 0.205165 80.8396 0.205166 82.65 2.5V2.5C84.4604 4.79483 87.9396 4.79484 89.75 2.5V2.5C91.5604 0.205166 95.0396 0.205165 96.85 2.5V2.5C98.6604 4.79484 102.14 4.79484 103.95 2.5V2.5C105.76 0.205165 109.24 0.205165 111.05 2.5V2.5C112.86 4.79484 116.34 4.79484 118.15 2.5V2.5C119.96 0.205165 123.44 0.205165 125.25 2.5V2.5C127.06 4.79484 130.54 4.79484 132.35 2.5V2.5C134.16 0.205165 137.64 0.205165 139.45 2.5V2.5C141.26 4.79484 144.74 4.79484 146.55 2.5V2.5C148.36 0.205165 151.84 0.205166 153.65 2.5V2.5C155.46 4.79484 158.94 4.79483 160.75 2.5V2.5C162.56 0.205167 166.04 0.205164 167.85 2.5V2.5C169.66 4.79483 173.14 4.79484 174.95 2.5V2.5C176.76 0.205165 180.24 0.205165 182.05 2.5V2.5C183.86 4.79484 187.34 4.79484 189.15 2.5V2.5C190.96 0.205165 194.44 0.205165 196.25 2.5V2.5C198.06 4.79484 201.54 4.79484 203.35 2.5V2.5C205.16 0.205165 208.64 0.205165 210.45 2.5L214 7"
        stroke="currentColor"
      />
    </svg>
  );
};

const Opengraph = ({ children, ...tags }) => {
  return (
    <>
      {Object.entries(tags).map(([key, val]) => (
        <meta property={`og:${key}`} content={val} />
      ))}
    </>
  );
};

const Twitter = ({ children, ...tags }) => {
  return (
    <>
      {Object.entries(tags).map(([key, val]) => (
        <meta name={`twitter:${key}`} content={val} />
      ))}
    </>
  );
};

const Bookshelf = () => {
  return (
    <svg
      id="bookshelf"
      viewBox="0 0 200 100"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      {Array.from({ length: 10 }, () => 0).map((_, idx) => {
        const height = Math.floor(Math.random() * (80 - 60 + 1)) + 60;
        return (
          <rect width="10" height={height} x={50 + 10 * idx} y={100 - height} />
        );
      })}
      <line x1="0" y1="100" x2="200" y2="100"></line>
    </svg>
  );
};
