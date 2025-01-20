import { Hono } from "hono"
import insights from "@/insights.ts"

export default function ({ exclude: customExclude }: { exclude?: URLPattern[] } = {}) {
  const router = new Hono()

  router.post("/p", async (c) => {
    // Don't track pageviews for excluded paths
    const exclude = [
      ...customExclude ?? [],
      new URLPattern({ pathname: '/p' }),
      new URLPattern({ pathname: '/stats' })
    ]

    if (exclude?.some(pattern => pattern.test(c.req.path))) {
      return c.json({})
    }

    const { pathname, referrer } = await c.req.json()

    await insights.pageview({
      pathname,
      referrer,
      userAgent: c.req.raw.headers.get('User-Agent') ?? undefined,
      ipAddress: c.req.raw.headers.get('X-Forwarded-For') ?? undefined
    })

    return c.json({})
  })

  router.get("/stats", async (c) => {
    return c.json({
      botCount: insights.botCount(),
      site: insights.site(),
      pages: insights.pages(),
      referrers: insights.referrers()
    })
  })

  return router
}
