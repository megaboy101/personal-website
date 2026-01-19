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
          href="https://fonts.googleapis.com/css2?family=Besley:ital,wght@0,400..900;1,400..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>

      <Layout>{children}</Layout>
    </html>
  );
};

const Layout = ({ children }: { children: Child }) => (
  <body>
    {children}
  </body>
);

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
