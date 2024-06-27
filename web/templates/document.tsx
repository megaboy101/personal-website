import { Child } from '@hono/jsx'
import Page from './page.tsx'


export default ({ children }: { children?: Child } ) => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <script type="module" defer src="https://cdn.skypack.dev/@hotwired/turbo@7.3?min"></script>

      <link rel="stylesheet" href="/ui/style.css" />

      <title>Jacob Bleser</title>
    </head>

    <Page>
      {children}
    </Page>
  </html>
)
