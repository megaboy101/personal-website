import blog from '@/blog.ts'
import { drive, json, notion } from "@/blog/sources.ts"
import insights from "@/insights/plug.ts"

blog({
  me: {
    'name': 'Jacob Bleser',
    'headline': 'Building community on the web',
    'locality': 'Brooklyn'
  },

  collections: {
    // 'posts': markdown('./content/posts'),
    // 'notes': notion({ id: 'dc4d0731cf0a4fcc93c9c93de9c8927a', token: Deno.env.get("NOTION_API_TOKEN") }),
    // 'posts': json('./obsidian.json'),
    'posts': drive({ fileId: '1POpOZcyRcZ4Bq6TWxSQ5xcTVRzDUEps1', keyFile: './service-account.json' })
  },

  plugs: [
    insights()
  ]
})

/**
 * Blog order of operations:
 * 1. Receive request
 * 2. Initialize an empty `blog` object
 * 3. Import the users `blog.ts` file
 *    - This could be configured in Deploy to only run once
 * 4. Read the collected settings from `blog` object
 * 5. Interpret request and settings into an action, either
 *    a route or some cron action
 * 
 * Page caching process:
 * 1. When someone needs a page, load cached html Cache API
 * 2. If it's been 24hr since that html was set, create a queue
 *    job to rebuild it
 * 3. Have a queue listener rebuild the page in the background
 * 
 * Ok as much as I hate to admit it, I'm thinking Deploy
 * isn't the move. Not because it isn't good, but because
 * my use cases don't really align.
 * 
 * Deploy is really designed for the same use cases Edge Workers
 * are, they just happen to be a much simpler and friendlier
 * experience
 */
