/**
 * App client configuration
 */

import { HonoRequest } from "hono"
import { Pageview } from "@/insights.ts"
import { sql } from "@/app/sql.ts"
import { run } from "@/app/runtime.ts"


/**
 * Persist a `HonoRequest` representing a pageview
 * request
 */
export function* savePageview(request: HonoRequest) {
  const pageview: Pageview = yield run(Pageview.fromHonoRequest, [request])

  yield sql.insert(pageview)
}

/**
 * Run sql table migrations
 */
export function* syncTables() {
  yield* sql.runAll(Pageview.table)
}
