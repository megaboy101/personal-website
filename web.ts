/**
 * HTTP Request handler
 */

import { Hono } from '@hono'
import { serveStatic } from '@hono/deno'
import { jsxRenderer } from '@hono/jsx-renderer'
import { notebook } from '@/notebook/middleware.ts'
import index from "@/web/pages/index.tsx";
import projects from "@/web/pages/projects.tsx";
import notes from "@/web/pages/notes.tsx";
import note from "@/web/pages/note.tsx";
import Page from '@/web/page.tsx'


const router = new Hono()

router.use('/styles/*', serveStatic({ root: './web/assets/' }))
router.use('/scripts/*', serveStatic({ root: './web/assets/' }))
router.use('/favicon.*', serveStatic({ root: './web/assets/' }))
router.use('*', notebook())
router.get("/*", jsxRenderer(Page, { docType: true }))

router.route("/", index)
router.route("/projects", projects)
router.route("/notes", notes)
router.route("/note", note)

/**
 * HTTP request handler for usage in `Deno.serve()`
 */
export const fetch = router.fetch
