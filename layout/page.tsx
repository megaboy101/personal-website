import { Child } from "hono/jsx"
import chroma from 'chroma'
import { useRequestContext } from "hono/jsx-renderer"

export default ({ children }: { children?: Child }) => {
  const ctx = useRequestContext()
  const head = ctx.get('head')
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <script type="module" async src="/scripts/cursor-tracker.js"></script>
        <script type="module" async src="/scripts/insights.js"></script>

        <link rel="stylesheet" href="/styles/style.css" />

        <link rel="shortcut icon" type="image/jpg" href="/favicon.png" />

        <title>{head?.title ?? 'Jacob Bleser'}</title>
      </head>

      <Layout>
        {children}
      </Layout>
    </html>
  )
}

const Layout = ({ children }: { children: Child }) => (
  <body style={`--day-night-color:${colorByHour()}`}>
    {children}
  </body>
)


const colors = chroma
  .scale([
    chroma.oklch(0.5306, 0.1297, 251.93),
    chroma.oklch(0.634, 0.195, 254.34),
    chroma.oklch(0.6967, 0.1609, 251.28),
    chroma.oklch(0.88, 0.12, 81),
    chroma.oklch(0.8265, 0.158, 78.6),
    chroma.oklch(0.21, 0.09, 276),
    chroma.oklch(0.03, 0.19, 263),
    chroma.oklch(0.02, 0.13, 230),
    chroma.oklch(0.53, 0.13, 252)
  ])
  .domain([
    0,
    0.1,
    0.39,
    0.43,
    0.46,
    0.52,
    0.56,
    0.84,
    1
  ])
  .colors(24, 'oklch')

function colorByHour() {
  const colorOffset = 17;
  const currentHour = Temporal.Now.zonedDateTimeISO('America/New_York').hour

  const colorIdx = (currentHour + colorOffset) % 24

  const color = colors[colorIdx]

  return `oklch(${Math.round(color[0] * 100)}% ${color[1]} ${color[2]})`
}
