import { Hono } from "hono"
import { createFactory } from 'hono/factory'
import { walk } from "@std/fs";
import { relative, resolve } from "@std/path";
import { zip } from '@std/collections'
import { secureHeaders } from "hono/secure-headers"
import { serveStatic } from "hono/deno"
import { jsxRenderer } from "hono/jsx-renderer"
import { z } from "zod"

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
  collections: { [collectionName:string]: Source },
  plugs?: Hono[]
}

const factory = createFactory()

const entrySchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  html: z.string()
})

export type Entry = z.infer<typeof entrySchema>
export type Collection = Entry[]

/**
 * A `Hono` router
 * 
 * Preconfigured with the following:
 * 1. Secure request headers by default
 * 2. Serve static assets at `/assets`
 */
function router() {
  const router = new Hono()

  router.use(secureHeaders())

  const staticHandler = serveStatic({ root: "./assets" })
  router.use("/styles/*", staticHandler)
  router.use("/scripts/*", staticHandler)
  router.use("/favicon.*", staticHandler)

  return router
}

/**
 * Returns the list of filenames in `layout/pages` relative
 * to the current working directory
 */
async function pagePaths() {
  return (await Array.fromAsync(walk('./layout/pages')))
    .filter(e => e.isFile)
    .map(e => relative(resolve(Deno.cwd(), './layout/pages'), e.path))
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

class Blog {
  #sources: Map<string, Source>
  collections: Map<string, Entry[]>
  #router: Hono
  #plugs: Hono[] = []

  constructor(opts: BlogOpts) {
    this.#sources = new Map(Object.entries(opts.collections))
    this.collections = new Map()
    this.#router = router()
    this.#plugs = opts?.plugs ?? []
  }

  /**
   * Pull content from all sources and setup routes for
   * layout files
   */
  async build() {
    // Run these concurrently so building layouts
    // isn't blocked by pulling content
    await Promise.allSettled([
      this.pull(),
      this.#layout()
    ])
  }

  /**
   * Pull latest content from all sources
   */
  async pull() {
    // Clear old collections before pulling new content
    this.collections.clear()

    for (const [key, source] of this.#sources) {
      try {
        const entries: Entry[] = []
        // We set the collection entries immediately
        // because it'll only copy a reference to the
        // `entries` array. Pushing items to that
        // array here will also update the collection.
        //
        // We do this so entries populate the collection
        // as they become available, rather than waiting
        // until all entries have loaded
        this.collections.set(key, entries)
        for await (const rawEntry of source.entries()) {
          const { success, data: entry, error } = entrySchema.safeParse(rawEntry)
          if (!success) throw new Error(error.toString())

          entries.push(entry)
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  /**
   * Build router from local filesystem
   */
  async #layout() {
    await this.#loadPageShell()
    await this.#loadNotFound()

    // Ensure plugs are applied last so notFound works
    this.#setPlugs()

    await this.#loadPageHandlers()
  }

  async #loadPageShell() {
    try {
      const page = (await import(resolve(Deno.cwd(), './layout/page.tsx'))).default
      this.#router.get("/*", jsxRenderer(page, { docType: true }))
    } catch (e) {
      console.error(e)
    }
  }

  async #loadNotFound() {
    try {
      const notFound = (await import(resolve(Deno.cwd(), './layout/404.tsx'))).default
      this.#router.notFound((c) => {
        return c.render(notFound())
      })
    } catch (e) {
      console.error(e)
    }
  }

  #setPlugs() {
    this.#plugs.forEach(plug => this.#router.route('/', plug))
  }

  async #loadPageHandlers() {
    const filePaths = await pagePaths()
    const urlPaths = filePaths.map(filePathToUrlPath)

    for (const [filePath, urlPath] of zip(filePaths, urlPaths)) {
      try {
        const handler = (await import(resolve(Deno.cwd(), './layout/pages', filePath))).default
        this.#router.get(urlPath, this.#buildRouteHandler(handler))
      } catch (e) {
        console.error(e)
      }
    }
  }

  #buildRouteHandler(handler: any) {
    return factory.createHandlers((c) => {
      if (c.req.param('collection')) {
        const collection = this.collections.get(c.req.param('collection'))
        if (!collection) return c.notFound();

        if (c.req.param('entry')) {
          const entry = collection?.find(e => e?.id === c.req.param('entry'))
          if (!entry) return c.notFound()
          return c.render(handler({ collection, entry }))
        }

        return c.render(handler({ collection }))
      }

      return c.render(handler({}))
    })[0]
  }

  /**
   * Return a built html page
   */
  page(request: Request) {
    return this.#router.fetch(request)
  }
}

export default async function(opts: BlogOpts) {
  const blog = new Blog(opts)

  // Sync content on startup, but don't block server
  // startup
  blog.build()

  Deno.serve({ port: 8080 }, (req) => blog.page(req))

  // Sync content every overnight
  Deno.cron("pulling latest content", "0 0 * * *", async () => {
    try {
      await blog.pull()
    } catch (e) {
      console.error(e)
    }
  })
}
