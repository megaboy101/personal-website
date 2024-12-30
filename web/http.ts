/**
 * HTTP Request handler
 */

import { Hono } from "hono"
import { secureHeaders } from "hono/secure-headers"
import { serveStatic } from "hono/deno"
import { jsxRenderer } from "hono/jsx-renderer"
import index from "~/web/html/pages/index.tsx"
import projects from "~/web/html/pages/projects.tsx"
import notes from "~/web/html/pages/notes.tsx"
import note from "~/web/html/pages/note.tsx"
import insights from "~/web/insights.ts"
import Page from "~/web/html/page.tsx"


const router = new Hono()

router.use(secureHeaders())

const staticHandler = serveStatic({ root: "/web/client" })
router.use("/styles/*", staticHandler)
router.use("/scripts/*", staticHandler)
router.use("/favicon.*", staticHandler)

router.get("/*", jsxRenderer(Page, { docType: true }))

router.route("/", index)
router.route("/projects", projects)
router.route("/notes", notes)
router.route("/note", note)

router.route("/insights", insights)

/**
 * HTTP request handler for usage in `Deno.serve()`
 */
export const fetch = router.fetch
