import { CompiledQuery, DummyDriver, Kysely, SqliteAdapter, SqliteIntrospector, SqliteQueryCompiler, sql as s } from 'kysely';
import { Database as Sqlite } from '@db/sqlite';
import { DenoSqlite3Dialect as SqliteDialect } from '@soapbox/kysely-deno-sqlite';

/**
 * An SQL query builder.
 * 
 * Queries compiled with this object can be
 * handed to `sqlStorage` for execution
 */
export const query = new Kysely<{ pageviews: { id: string, fingerprint: string, pathname: string, referrer: string | null, is_bot: boolean, created_at: string } }>({
  dialect: {
    createAdapter: () => new SqliteAdapter(),
    createDriver: () => new DummyDriver(),
    createIntrospector: (db) => new SqliteIntrospector(db),
    createQueryCompiler: () => new SqliteQueryCompiler(),
  },
})

/**
 * A persistent SQL store
 */
export const sqlStorage = new Kysely({
  dialect: new SqliteDialect({
    database: new Sqlite('./data/database.db'),
  }),
});

// Configure SQLite
{
  await s`PRAGMA journal_mode = WAL`.execute(sqlStorage)
  await s`PRAGMA synchronous = NORMAL`.execute(sqlStorage)
  await s`PRAGMA busy_timeout = 5000`.execute(sqlStorage)
  await s`PRAGMA cache_size = -20000`.execute(sqlStorage)
  await s`PRAGMA foreign_keys = ON`.execute(sqlStorage)
  await s`PRAGMA auto_vacuum = INCREMENTAL`.execute(sqlStorage)
  await s`PRAGMA temp_store = MEMORY`.execute(sqlStorage)
  await s`PRAGMA page_size = 8192`.execute(sqlStorage)
}

// FRONTEND

/**
 * An sql command builder
 */
export const sql = {
  /**
   * Run an arbitrary query
   */
  run(query: CompiledQuery) {
    return ({ type: 'SQL', query })
  },

  /**
   * Run an arbitrary list of queries
   */
  *runAll(queries: CompiledQuery[]) {
    for (const query of queries) {
      yield ({ type: 'SQL', query })
    }
  },

  /**
   * Insert a single row into storage
   * 
   * Supports any arbitrary object with an `insert()`
   * method
   */
  insert(insertable: { insert(): CompiledQuery }) {
    return ({ type: 'SQL', query: insertable.insert() })
  }
}


// BACKEND

/**
 * Execute a compiled sql query
 */
export async function exec(query: CompiledQuery) {
  return await sqlStorage.executeQuery(query)
}

/**
 * Port definition for usage in an application
 * server
 */
export const port = {'SQL': (command: any) => exec(command.query)}
