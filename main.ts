/**
 * Kicks off all our running services and processes
 */
import { load } from 'dotenv'
import { connect, sync } from '@/notebook.ts'
import { fetch } from '@/web.ts'

// Load local environment variables
await load({ export: true })

// For debugging, sync on startup
// await connect()
// await sync()

// Start our CRON scheduler
const syncSchedule = Deno.env.get('NOTION_SYNC_SCHEDULE') ?? '*/5 * * * *' // Every 5 minutes by default
Deno.cron("sync notes", syncSchedule, async () => {
  await connect()
  await sync()
})

// Start our HTTP server
Deno.serve(fetch)
