/**
 * Kicks off all our running services and processes
 */
import "@std/dotenv/load"
import { sync } from "@/notebook.ts"
import { fetch } from "@/web.ts"

// Immediately sync on startup.
// Although this is a promise, we don't
// await it since it can be safely resolved
// in the background, and we don't want it
// to delay server startup
sync()

// Start our HTTP server
Deno.serve({ port: 8080 }, fetch)

/**
 * Theoretical Project Structure:
 *
 * root
 * - src => Project source code
 *   - web => Web application logic
 *   - web.ts => Entrypoint to web api
 *   -
 * - tasks => Misc automation scripts. Should not depend on src code. Just supplements deno tasks
 * - config => Various config files, like env vars, db setup, docker, deploy configs
 */
