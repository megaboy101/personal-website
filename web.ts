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
import Document from '@/web/templates/document.tsx'
import { ariaCurrent } from "@/middleware.ts";

/**
 * ES Module based worker object for usage in Cloudflare
 * workers or other worker-based runtimes
 */
export const router = new Hono()

router.use('/style/*', serveStatic({ root: './web/' }))
router.use('/elements/*', serveStatic({ root: './web/' }))
router.use('*', notebook())
router.get("/*", jsxRenderer(Document, { docType: true }))
router.get('*', ariaCurrent)

router.route("/", index)
router.route("/projects", projects)
router.route("/notes", notes)
router.route("/note", note)

/**
 * HTTP request handler for usage in `Deno.serve()`
 */
export const fetch = router.fetch
