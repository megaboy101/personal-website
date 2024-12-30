import { isbot } from 'isbot'
import { decoder, encoder } from "@/encoding.ts"
import { HonoRequest } from "hono"
import { query } from '@/app/sql.ts'
import { sql } from "kysely"

/**
 * A basic `Insights API` for anonymously tracking
 * and analyzing website traffic
 * 
 * This can be thought of as a server-side consumer
 * for the `Beacon API`. Whereas the `Beacon API`
 * enables reliable _sending_ events from a client,
 * the `Insights API` can _consume_ and store events
 * for later querying and analysis.
 * 
 * Additionally, several helper methods are included
 * for typical analytics query patterns, such as a
 * count of how many page views have been bots
 * 
 * This module just provides a storage and query
 * engine for insights, it does not itself
 * track anything automatically. You'll need to plug
 * this api into a web server (such as via
 * middleware) to actually record web traffic
 */
class Insights {
  static store = Deno.openKv()

  static async recordPageview(pageview: Pageview) {}

  static async botCount() {}

  static async site() {}

  static async pages() {}

  static async page(path: string) {}

  static async *pageviews() {}
}


export class Pageview {
  constructor(
    public fingerprint: string,
    public pathname: string,
    public ts: Temporal.PlainDateTime,

    public id?: string,
    public referrer?: string,
    public isBot?: boolean
  ) {}

  static async fromHonoRequest(request: HonoRequest): Promise<Pageview> {
    const { pathname, referrer } = await request.json()
    const isBot = isbot(request.raw.headers.get('User-Agent'))
    const vId = await fingerprint(request.raw)
    return new Pageview(
      vId,
      pathname,
      Temporal.Now.plainDateTimeISO(),
      undefined,
      referrer,
      isBot
    )
  }

  static table = [
    sql`
      DROP TABLE IF EXISTS pageviews
    `.compile(query),
    sql`
    CREATE TABLE pageviews (
      id TEXT PRIMARY KEY,
      fingerprint TEXT NOT NULL,
      pathname TEXT NOT NULL,
      referrer TEXT NULL,
      is_bot BOOLEAN NOT NULL,
      created_at TEXT NOT NULL
    )
  `.compile(query),
  ]

  insert() {
    return query
      .insertInto('pageviews')
      .values({
        id: crypto.randomUUID(),
        fingerprint: this.fingerprint,
        pathname: this.pathname,
        referrer: this.referrer ?? null,
        is_bot: this.isBot ?? false,
        created_at: this.ts.toString(),
      })
      .compile()
  }
}

async function fingerprint(request: Request): Promise<string> {
  const userAgent = request.headers.get('user-agent') ?? 'unknown'
  const ipAddr = request.headers.get('x-forwarded-for') ?? 'unknown'
  const hashContent = encoder.encode(ipAddr + userAgent)
  const hash = await crypto.subtle.digest("SHA-256", hashContent)
  const hashView = new Uint8Array(hash)

  return decoder.decode(hashView)
}
