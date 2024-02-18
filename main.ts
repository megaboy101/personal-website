/**
 * Kicks off all our running services and processes
 */
import 'https://deno.land/std@0.210.0/dotenv/load.ts'
import { sync } from '@/notebook.ts'
import { fetch } from '@/web.ts'


// Immediately sync on startup.
// Although this is a promise, we don't
// await it since it can be safely resolved
// in the background, and we don't want it
// to delay server startup
sync()

// Start our HTTP server
Deno.serve({ port: 8080 }, fetch)
