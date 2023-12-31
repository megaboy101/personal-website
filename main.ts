/**
 * Kicks off all our running services and processes
 */
import 'https://deno.land/std@0.210.0/dotenv/load.ts'
import { connect, sync } from '@/notebook.ts'
import { fetch } from '@/web.ts'


// For debugging, sync on startup
await connect()
await sync()

// Start our CRON scheduler
// const syncSchedule = Deno.env.get('NOTION_SYNC_SCHEDULE') ?? '*/5 * * * *' // Every 5 minutes by default
// Deno.cron("sync notes", syncSchedule, async () => {
//   await connect()
//   await sync()
// })

// Start our HTTP server
Deno.serve({ port: 8080 }, fetch)
