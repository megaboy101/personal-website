// import { DummyDriver, Kysely, SqliteAdapter, SqliteIntrospector, SqliteQueryCompiler } from 'kysely';
import { Database } from '@db/sqlite';
// import { DenoSqlite3Dialect as SqliteDialect } from '@soapbox/kysely-deno-sqlite';
import { resolve } from "@std/path"

// // Type definitions
// interface Database {
//   pageviews: PageviewTable
// }

// interface PageviewTable {
//   id: string,
//   fingerprint: string
//   pathname: string
//   referrer?: string
//   is_bot?: boolean
//   created_at: string
// }

// /**
//  * A persistent SQL store
//  */
// const db = new Kysely<Database>({
//   dialect: new SqliteDialect({
//     database: new Sqlite(resolve(Deno.cwd(), 'data/insights.db')),
//   }),
// });

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
