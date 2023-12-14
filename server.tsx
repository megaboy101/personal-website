/**
 * Dev-server for live-reloading the site as the code changes
 */

import { Hono } from 'hono'
import { jsxRenderer, serveStatic } from "hono/middleware"
import index from "@/pages/index.tsx";
import projects from "@/pages/projects.tsx";
import Document from '@/templates/document.tsx'

const app = new Hono()

app.use('*', serveStatic({ root: './' }))

app.get("/*", jsxRenderer(({ children }) => (
  <Document>{children}</Document>
)))

app.route("/", index)
app.route("/projects", projects)

Deno.serve(app.fetch)
