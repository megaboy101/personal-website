import { Hono } from "hono"
import { createFactory } from 'hono/factory'
import { contextStorage, getContext } from 'hono/context-storage'
import { walk } from "@std/fs";
import { join, relative, resolve } from "@std/path";
import { secureHeaders } from "hono/secure-headers"
import { serveStatic } from "hono/deno"
import { jsxRenderer } from "hono/jsx-renderer"
import { z } from "zod"
import { JSX } from "hono/jsx/jsx-runtime"
import { Cls, use } from "@/mixins.ts"

// MARK: Type definitions

type Me = {
  name?: string
  headline?: string
  locality?: string
}

interface Source {
  entries(): AsyncGenerator<object, any>
}

type BlogOpts = {
  title?: string,
  me?: Me,
  collections?: { [collectionName:string]: Source },
  plugs?: Hono[]
}

const entrySchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  html: z.string(),
  properties: z.object({}).passthrough()
})

export type Entry = z.infer<typeof entrySchema>
export type Collection = Entry[]

// MARK: Blog

interface Servable {
  fetch(request: Request): Response | Promise<Response>
}

const Http = (cls: Cls<Servable>) => class Http extends cls {
  /**
   * Listen for HTTP requests on port `8080`
   */
  serve(port = 8080) {
    Deno.serve({ port }, this.fetch ? (request) => this.fetch(request) : (() => new Response('Hello, world!')))
  }
}

interface Syncable {
  refresh(): Promise<void>
}

const Sync = (cls: Cls<Syncable>) => class Sync extends cls {
  /**
   * Schedule an action to happen later
   */
  schedule(schedule: string | Deno.CronSchedule) {
    Deno.cron("pulling latest content", schedule, () => {
      const handler = super.refresh()
      if (!handler) return

      handler.catch(e => {
        console.error(e)
      })
    })
  }
}

const FilesystemTemplates = (cls: Cls) => class FilesystemRouter extends cls {
  async templates() {
    return await blogPages()
  }
}

class Blog extends use(Http, Sync, FilesystemTemplates) {
  #sources: Map<string, Source> = new Map()
  #collections: Map<string, Entry[]> = new Map()
  #router?: Hono

  /**
   * Pull content from all sources and setup routing defined
   * by the local filesystem
   */
  async init(opts: BlogOpts = {}) {
    this.#router = router(
      await super.templates(),
      opts?.plugs ?? [],
      { collections: this.#collections }
    )

    if (opts?.collections) this.#sources = new Map(Object.entries(opts?.collections))

    await this.refresh()
  }

  /**
   * Pull latest content from all sources
   */
  async refresh() {
    // Clear old collections before pulling new content
    this.#collections.clear()

    for (const [name, source] of this.#sources) {
      try {
        const entries: Entry[] = []
        // We set the collection entries immediately
        // because it'll only copy a reference to the
        // `entries` array. Pushing items to that
        // array here will also update the collection.
        //
        // We do this so entries populate the collection
        // as they are loaded, rather than waiting
        // until all entries have loaded before saving any
        this.#collections.set(name, entries)
        for await (const rawEntry of source.entries()) {
          const { success, data: entry, error } = entrySchema.safeParse(rawEntry)
          if (!success) console.error(error.toString(), rawEntry)
          else entries.push(entry)
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  /**
   * Route a `Request -> Response`
   */
  fetch(request: Request) {
    return this.#router?.fetch(request) ?? new Response('Blog not initialized')
  }
}


export default function(opts: BlogOpts) {
  const blog = new Blog()

  // Sync content on startup, but don't block server
  // startup
  blog.init(opts)

  // Start http server
  blog.serve()

  // Refresh nightly at midnight
  blog.schedule("0 0 * * *")
}

// MARK: Router

/**
 * A `Hono` router
 * 
 * Pre-configured with the following:
 * 1. Secure request headers by default
 * 2. Serve static assets at `/assets`
 */
function router(fileHandlers: Awaited<ReturnType<typeof blogPages>>, plugins: Hono[] = [], ctx: Record<string, any> = {}) {
  const router = new Hono()

  // General middleware
  router.use(secureHeaders())

  // Serve static files
  const staticHandler = serveStatic({ root: "./assets" })
  router.use("/styles/*", staticHandler)
  router.use("/scripts/*", staticHandler)
  router.use("/favicon.*", staticHandler)
  router.use("/img/*", staticHandler)

  // Use context storage for fetching collections in handlers
  router.use(contextStorage())

  // Build routes from filesystem
  const { layout, notFound, pages } = fileHandlers
  if (layout) router.get("/*", jsxRenderer(layout.template, { docType: true }))
  if (notFound) router.notFound((c) => c.render(notFound.template()))

  // Ensure plugs are applied last so notFound works
  plugins.forEach(p => router.route('/', p))

  Object.entries(ctx).forEach(([key, val]) => (
    router.use('*', async (c, next) => {
      c.set(key, val)
      await next()
    })
  ))

  for (const [filePath, page] of pages) {
    router.get(filePathToUrlPath(filePath), pageHandler(page))
  }

  return router
}

function pageHandler(page: Page): unknown {
  return createFactory().createHandlers((c) => {
    if (c.req.param('collection')) {
      const collection = useCollection(c.req.param('collection'))
      if (!collection) return c.notFound();

      if (c.req.param('entry')) {
        const entry = collection?.find(e => e?.id === c.req.param('entry'))
        if (!entry) return c.notFound()
        if (page.head) c.set('head', typeof page.head === 'function' ? page.head({ collection, entry }) : page.head)
        return c.render(page.template({ collection, entry, ctx: c.req }))
      }

      return c.render(page.template({ collection, ctx: c.req }))
    }

    return c.render(page.template({ctx: c.req}))
  }).at(0)
}

// MARK: Filesystem

type Page = {template: ((...props: any) => JSX.Element), head?: object}

async function blogPages(): Promise<{ layout?: Page, notFound?: Page, pages: [string, Page][] }> {
  const root = join(Deno.cwd(), 'layout')
  const layout = await importPage(join(root, 'page.tsx'))
  const notFound = await importPage(join(root, '404.tsx'))

  const pages: [string, Page][] = []
  for (const filePath of await pagePaths(join(root, 'pages'))) {
    const page = await importPage(resolve(root, 'pages', filePath))
    if (!page) continue
    pages.push([filePath, page])
  }

  return {
    layout, notFound, pages
  }
}

/**
 * Imports and returns the default export if is
 * JSX, otherwise `undefined`
 */
async function importPage(path: string): Promise<Page | undefined> {
  let module
  try {
    module = await import(path)
  } catch (e) {
    console.error(e)
    return
  }

  return {template: module.default, head: module?.head}
}

/**
 * Returns a list of filepaths relative to `Deno.cwd()`
 */
async function pagePaths(rootPath: string): Promise<string[]> {
  const paths = []
  for await (const entry of walk(rootPath)) {
    if (!entry.isFile) continue
    paths.push(relative(resolve(Deno.cwd(), rootPath), entry.path))
  }

  return paths
}

/**
 * Maps a filepath representing a url path to a router-interpretable
 * url scheme
 * 
 * Examples
 * - `/index.tsx` -> `/`
 * - `[my-path].tsx` -> `:my-path`
 */
function filePathToUrlPath(filePath: string) {
  const urlPath = filePath
    .replace(/\.tsx?$/g, '') // remove tsx extension
    .replace(/^\/?index$/, '/') // `/index` -> `/`
    .replace(/\/index$/, '') // `/my-path/index` -> `/my-path`
    .replace(/\[\.{3}.+\]/, '*') // `[...my-paths]` -> '*'
    .replace(/\[(.+?)\]/g, ':$1') // `[my-path]` -> `:my-path`

  return /^\//.test(urlPath) ? urlPath : '/' + urlPath
}


// Context hooks

export function useCollection(name?: string): Collection | undefined {
  if (!name) return

  const ctx = getContext()
  return ctx.get('collections')?.get(name)
}
