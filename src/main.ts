/**
 * Kicks off all our running services and processes
 */
import "@std/dotenv/load"
import { sync } from "@/notebook.ts"
import { fetch } from "@/web.ts"
import { perform } from "@/runtime.ts"
import { syncTables } from "@/app.ts"

// Migrate sql tables
await perform(syncTables())

// Immediately sync on startup.
// Although this is a promise, we don't
// await it since it can be safely resolved
// in the background, and we don't want it
// to delay server startup
sync()

// Start our HTTP server
Deno.serve({ port: 8080 }, fetch)
