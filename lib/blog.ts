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

class Blog {
  #sources: Map<string, Source>
  collections: Map<string, Entry[]>
  #router: Hono
  #plugs: Hono[] = []

  constructor(opts: BlogOpts) {
    this.#sources = new Map(Object.entries(opts.collections))
    this.collections = new Map()
    this.#router = new Hono()
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
        const entries = []
        for await (const rawEntry of source.entries()) {
          const { success, data: entry, error } = entrySchema.safeParse(rawEntry)
          if (!success) throw new Error(error.toString())
          entries.push(entry)
        }
        this.collections.set(key, entries)
      } catch (e) {
        console.error(e)
      }
    }
  }

  /**
   * Build router from local filesystem
   */
  async #layout() {
    const filePaths = await this.#filepaths()
    const urlPaths = filePaths.map(this.#filePathToUrlPath)

    await this.#presetRouter()

    for (const [filePath, urlPath] of zip(filePaths, urlPaths)) {
      try {
        const handler = (await import(resolve(Deno.cwd(), './layout/pages', filePath))).default
        this.#router.get(urlPath, this.#buildRouteHandler(handler))
      } catch (e) {
        console.error(e)
      }
    }
  }

  async #presetRouter() {
    this.#router.use(secureHeaders())
  
    const staticHandler = serveStatic({ root: "./assets" })
    this.#router.use("/styles/*", staticHandler)
    this.#router.use("/scripts/*", staticHandler)
    this.#router.use("/favicon.*", staticHandler)

    try {
      const page = (await import(resolve(Deno.cwd(), './layout/page.tsx'))).default
      this.#router.get("/*", jsxRenderer(page, { docType: true }))
    } catch (e) {
      console.error(e)
    }

    try {
      const notFound = (await import(resolve(Deno.cwd(), './layout/404.tsx'))).default
      this.#router.notFound((c) => {
        return c.render(notFound())
      })
    } catch (e) {
      console.error(e)
    }

    // Ensure plugs are applied last so notFound works
    this.#plugs.forEach(plug => this.#router.route('/', plug))
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

  async #filepaths() {
    const filePaths = []

    for await (const dirEntry of walk('./layout/pages')) {
      const path = relative(resolve(Deno.cwd(), './layout/pages'), dirEntry.path)

      if (dirEntry.isFile) {
        filePaths.push(path)
      }
    }

    return filePaths
  }

  #filePathToUrlPath(filePath: string) {
    const urlPath = filePath
      .replace(/\.tsx?$/g, '') // remove tsx extension
      .replace(/^\/?index$/, '/') // `/index` -> `/`
      .replace(/\/index$/, '') // `/my-path/index` -> `/my-path`
      .replace(/\[\.{3}.+\]/, '*') // `[...my-paths]` -> '*'
      .replace(/\[(.+?)\]/g, ':$1') // `[my-path]` -> `:my-path`
  
    return /^\//.test(urlPath) ? urlPath : '/' + urlPath
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
