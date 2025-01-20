import { Hono } from "hono"
import { createFactory } from 'hono/factory'
import { walk } from "@std/fs";
import { relative, resolve } from "@std/path";
import { zip } from '@std/collections'
import { secureHeaders } from "hono/secure-headers"
import { serveStatic } from "hono/deno"
import { jsxRenderer } from "hono/jsx-renderer"

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
  plugs: Hono[]
}

const factory = createFactory()

class Blog {
  #sources: Map<string, Source>
  collections: Map<string, object[]>
  #router: Hono

  constructor(opts: BlogOpts) {
    this.#sources = new Map(Object.entries(opts.collections))
    this.collections = new Map()
    this.#router = new Hono()

    // Apply plugs before anything else
    opts?.plugs.forEach(plug => this.#router.route('/', plug))
  }

  /**
   * Pull latest content from all sources
   */
  async refresh() {
    await Promise.allSettled([
      this.#pull(),
      this.#layout()
    ])
  }

  /**
   * Pull latest content from all sources
   */
  async #pull() {
    for (const [key, source] of this.#sources) {
      const entries = []
      for await (const entry of source.entries()) {
        entries.push(entry)
      }

      this.collections.set(key, entries)
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

    const page = (await import(resolve(Deno.cwd(), './layout/page.tsx'))).default

    this.#router.get("/*", jsxRenderer(page, { docType: true }))
  }

  #buildRouteHandler(handler: any) {
    return factory.createHandlers((c) => {
      const collection = this.collections.get(c.req.param('collection'))
      const entry = collection?.find(e => e?.id === c.req.param('entry'))
      const html = handler({ collection, entry })
      return c.render(html)
    }).at(0)
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
  // Build blog state
  // - Download all content
  // - Build content into collections and documents
  // - Parse layout filenames
  // Start webserver

  const blog = new Blog(opts)

  await blog.refresh()

  Deno.serve({ port: 8080 }, (req) => blog.page(req))
}
