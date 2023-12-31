import { FC, Child } from 'hono/jsx'
import Page from './page.tsx'


export default ({ children }: { children?: Child } ) => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <script type="module" defer src="https://cdn.skypack.dev/@hotwired/turbo@7.3?min"></script>

      <link rel="stylesheet" href="/style/tokens.css" />
      <link rel="stylesheet" href="/style/preflight.css" />
      <link rel="stylesheet" href="/style/layers.css" />
      <link rel="stylesheet" href="/style/fonts.css" />
      <link rel="stylesheet" href="/style/layout.css" />
      <link rel="stylesheet" href="/style/elements.css" />
      <link rel="stylesheet" href="/style/utilities.css" />

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css" />

      <script type="module" defer src="/elements/smol.js"></script>
      <script type="module" defer src="/elements/class-group.js"></script>

      <title>Jacob Bleser</title>
    </head>

    <Page>
      {children}
    </Page>
  </html>
)
