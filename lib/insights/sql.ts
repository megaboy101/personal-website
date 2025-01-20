import { Database } from '@db/sqlite';
import { resolve } from "@std/path"

const db = new Database(resolve(Deno.cwd(), 'data/insights.db'))


// Configure SQLite `pragma` settings
db.sql`PRAGMA journal_mode = WAL`
db.sql`PRAGMA synchronous = NORMAL`
db.sql`PRAGMA busy_timeout = 5000`
db.sql`PRAGMA cache_size = -20000`
db.sql`PRAGMA foreign_keys = ON`
db.sql`PRAGMA auto_vacuum = INCREMENTAL`
db.sql`PRAGMA temp_store = MEMORY`
db.sql`PRAGMA page_size = 8192`

// Sql table migrations
db.sql`
  CREATE TABLE IF NOT EXISTS pageviews (
    id TEXT PRIMARY KEY NOT NULL,
    fingerprint TEXT NOT NULL,
    pathname TEXT NOT NULL,
    referrer TEXT,
    is_bot BOOLEAN,
    created_at TEXT NOT NULL
  )
`

export default db
