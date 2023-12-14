import { FC } from 'hono/jsx'
import Page from '@/templates/page.tsx'


export default ({ children }) => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <link rel="stylesheet" href="style/tokens.css" />
      <link rel="stylesheet" href="style/preflight.css" />
      <link rel="stylesheet" href="style/layers.css" />
      <link rel="stylesheet" href="style/fonts.css" />
      <link rel="stylesheet" href="style/layout.css" />
      <link rel="stylesheet" href="style/elements.css" />
      <link rel="stylesheet" href="style/utilities.css" />

      <script type="module" defer src="elements/smol.js"></script>
      <script type="module" defer src="elements/class-group.js"></script>

      <title>Jacob Bleser</title>
    </head>

    <Page>
      {children}
    </Page>
  </html>
)
