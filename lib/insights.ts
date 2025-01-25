import { isbot } from 'isbot'
import db from './insights/sql.ts'

/**
 * Record a `pageview`
 * 
 * Pageview events are intended to come from `Request`s
 * sent by `insights.js`, but can also come from a custom
 * source
 * 
 * # Examples
 * 
 * ## Create a pageview
 * 
 * ```typescript
 * import { assertEquals } from '@std/assert'
 * 
 * // Empty the db first
 * clear()
 * 
 * // Record a pageview
 * await pageview({
 *   pathname: '/first',
 *   userAgent: 'Chrome',
 *   ipAddress: '127.0.0.1'
 * })
 * 
 * // Notice the userAgent and ipAddress are the same.
 * // This is the same user viewing both pages
 * await pageview({
 *   pathname: '/second',
 *   userAgent: 'Chrome',
 *   ipAddress: '127.0.0.1'
 * })
 * 
 * // Fetch the results
 * const statsByDay = site()
 * 
 * assertEquals(statsByDay[0].total, 2)
 * assertEquals(statsByDay[0].unique, 1)
 * ```
 */
export async function pageview(page: { pathname: string, referrer?: string, userAgent?: string, ipAddress?: string }) {
  const print = await fingerprint(page.userAgent, page.ipAddress)
  
  db.sql`
    INSERT INTO
      pageviews
      (id, fingerprint, pathname, referrer, is_bot, created_at)
    VALUES
      ( ${crypto.randomUUID()}
      , ${print}
      , ${page.pathname}
      , ${page.referrer ?? null}
      , ${page.userAgent ? isbot(page.userAgent) : null}
      , ${new Date().toISOString()}
      )
  `
}

/**
 * Delete all `pageview` entries
 * 
 * # Examples
 * 
 * Add some items and clear them afterwards
 * ```typescript
 * import { assertEquals } from "@std/assert";
 * 
 * await pageview({
 *   pathname: '/',
 *   userAgent: 'Chrome',
 *   ipAddress: '127.0.0.1'
 * })
 * 
 * await pageview({
 *   pathname: '/aye',
 *   userAgent: 'Chrome',
 *   ipAddress: '127.0.0.1'
 * })
 * 
 * clear()
 * 
 * assertEquals(await site(), [])
 * ```
 */
export function clear() {
  db.sql`
    DELETE FROM pageviews
  `
}

/**
 * An breakdown of site-wide stats
 * 
 * # Examples
 * 
 * ## Fetch basic site data
 * 
 * ```typescript
 * import { assertEquals } from '@std/assert'
 * 
 * // Create some data
 * clear()
 * await pageview({
 *   pathname: '/',
 *   userAgent: 'Chrome',
 *   ipAddress: '127.0.0.1'
 * })
 * await pageview({
 *   pathname: '/',
 *   userAgent: 'Chrome',
 *   ipAddress: '127.0.0.1'
 * })
 * 
 * // Fetch stats
 * const statsByDay = site()
 * const today = statsByDay[0]
 * 
 * assertEquals(today.total, 2)
 * assertEquals(today.unique, 1)
 * ```
 * 
 * 
 * ## Counts are grouped by day
 * 
 * ```typescript
 * import { assertEquals } from '@std/assert'
 * import { FakeTime } from '@std/testing/time'
 * 
 * await clear()
 * using time = new FakeTime()
 * 
 * // Record a pageview today
 * await pageview({
 *   pathname: '/',
 *   userAgent: 'Chrome',
 *   ipAddress: '127.0.0.1'
 * })
 * 
 * // And tomorrow
 * time.now = Date.now() + (1000 * 60 * 60 * 24)
 * await pageview({
 *   pathname: '/',
 *   userAgent: 'Chrome',
 *   ipAddress: '127.0.0.1'
 * })
 * 
 * // Fetch stats
 * const statsByDay = await site()
 * const today = statsByDay[0]
 * const tomorrow = statsByDay[1]
 * 
 * assertEquals(today.total, 1, 'today does not match expected')
 * assertEquals(tomorrow.total, 1, 'today does not match expected')
 * ```
 */
export function site(): Array<{ total: number, unique: number, created_at: string }> {
  return db.sql`
    SELECT
      COUNT(*) as total,
      COUNT(DISTINCT fingerprint) as "unique",
      created_at
    FROM
      pageviews
    WHERE
      is_bot != TRUE
    GROUP BY
      date(created_at)
    ORDER BY
      date(created_at) ASC
  `
}

/**
 * A collection of stats by page
 */
export function pages(): Array<{ pathname: string, total: number, unique: number, created_at: number }> {
  return db.sql`
    SELECT
      pathname,
      COUNT(id) as total,
      COUNT(DISTINCT fingerprint) as "unique",
      created_at
    FROM
      pageviews
    WHERE
      is_bot != TRUE
    GROUP BY
      pathname, date(created_at)
  `
}

/**
 * Stats for a specific page
 */
export function page(pathname: string) {
  return db.sql`
    SELECT
      pathname,
      COUNT(id) as total,
      COUNT(DISTINCT fingerprint) as unique,
      created_at
    FROM
      pageviews
    WHERE
      pathname = ${pathname}
      is_bot != TRUE
    GROUP BY
      date(created_at)
  `
}

/**
 * All-time stats for referrers
 */
export function referrers() {
  return db.sql`
    SELECT
      referrer,
      COUNT(*) as total,
      created_at
    FROM
      pageviews
    GROUP BY
      referrer, date(created_at)
  `
}

/**
 * All-time count of the how many bots
 * have been seen
 */
export function botCount(): number {
  return db.sql`
    SELECT
      COUNT(*) as total
    FROM
      pageviews
    WHERE
      is_bot = TRUE
  `.at(0)?.total
}

async function fingerprint(userAgent = 'unknown', ipAddress = 'unknown'): Promise<string> {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const hashContent = encoder.encode(ipAddress + userAgent)
  const hash = await crypto.subtle.digest("SHA-256", hashContent)
  const hashArr = new Uint8Array(hash)

  return decoder.decode(hashArr)
}

/**
 * A basic `Insights API` for anonymously tracking
 * and analyzing website traffic
 * 
 * This is a server-side consumer for the `Beacon API`.
 * Whereas the `Beacon API` enables reliable _sending_
 * events from a client, the `Insights API` can _consume_
 * and store events for later querying and analysis.
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
export default {
  // Writes
  pageview,
  clear,

  // Queries
  site,
  pages,
  page,
  referrers,
  botCount,
}
