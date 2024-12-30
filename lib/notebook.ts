/**
 * Notebook API backed by `notion`
 */

import { getPage, getPageHtml } from "@/notion.ts"
import * as C from "@/notebook/collection.ts"

/**
 * A labeled group of entries
 */
export type Collection = {
  label: string
  entries: Summary[]
}

/**
 * Basic details about an `Entry`.
 */
export type Summary = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

/**
 * The full content of a single entry
 */
export type Entry = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  html: string
}

/**
 * ISO timestamp for when entries were last synced
 */
export type SyncTimestamp = {
  timestamp: string
}

// Connection to Deno KV
let kv: Deno.Kv | null

// This is a hard-coded page ID corresponding
// to the "Blog" page in my notion
const COLLECTIONS_PAGE_ID = "dc4d0731cf0a4fcc93c9c93de9c8927a"

// In case we don't have a last-synced timestamp to work with,
// this is how far in the past we will look to load new entries
const OLDEST_SYNC_LOOKBACK_TS = new Date(2015, 0)

// Objects for encoding/decoding Deno KV data in UTF-8
const encoder = new TextEncoder()
const decoder = new TextDecoder()

/**
 * Open a connection to the notebook.
 *
 * This is required before being able to fetch any data
 */
export async function connect() {
  if (!kv) {
    kv = await Deno.openKv()
  }
}

/**
 * Fetches a list of entries grouped by collection
 */
export async function getCollections() {
  return await load<Collection[]>(["sections"])
}

/**
 * Fetches the full content of a single entry
 */
export async function getEntry(id: string) {
  return await load<Entry>(["note", id])
}

/**
 * Sync entries from Notion into local KV storage
 */
export async function sync() {
  console.info("Syncing all entries")

  console.info("Checking when last synced")
  const lastSyncedAt = await getLastSyncedAt()

  console.info("Syncing directory")
  const collections = await syncCollections()

  const summaries = collections.flatMap((c) => c.entries)
  const entryTasks = summaries.reduce((tasks, summary) => {
    const updatedAt = new Date(summary.updatedAt)
    if (lastSyncedAt > updatedAt) return tasks

    return [...tasks, syncEntry(summary)]
  }, [] as Promise<Entry>[])

  await Promise.allSettled(entryTasks)

  const timestamp = new Date().toISOString()
  await save(["lastSyncedAt"], { timestamp })

  console.info(`Sync completed at [${timestamp}]!`)
}

/**
 * Removes all data from KV storage
 */
export async function clear() {
  const rows = kv?.list({ prefix: [] })

  if (!rows) return null

  for await (const row of rows) {
    await kv?.delete(row.key)
  }
}

async function getLastSyncedAt() {
  const lastSyncedAt = await load<SyncTimestamp>(["lastSyncedAt"])

  return lastSyncedAt?.timestamp
    ? new Date(lastSyncedAt.timestamp)
    : OLDEST_SYNC_LOOKBACK_TS
}

async function syncCollections() {
  const collectionsPageBlocks = await getPage(COLLECTIONS_PAGE_ID)
  const collections = C.fromNotionBlocks(collectionsPageBlocks)
  await saveCollections(collections)

  return collections
}

async function syncEntry({ id, title, updatedAt, createdAt }: Summary) {
  console.log(`Syncing entry [${title}], was last updated at: [${updatedAt}]`)

  const html = await getPageHtml(id)

  const entry: Entry = {
    id,
    title,
    createdAt,
    updatedAt,
    html,
  }

  await saveEntry(entry)

  return entry
}

async function saveCollections(collections: Collection[]) {
  return await save(["sections"], collections)
}

async function saveEntry(entry: Entry) {
  return await save(["note", entry.id], entry)
}

async function save(key: Deno.KvKey, value: unknown) {
  if (!kv) await connect()

  // We serialize data to a UTF-8 string instead of the default
  // UTF-16 format because it's more space efficient, and Deno
  // KV has a string 64KB limit on value size
  const valueStr = JSON.stringify(value)
  const valueBin = encoder.encode(valueStr)

  return await kv!.set(key, valueBin)
}

async function load<T extends object>(key: Deno.KvKey): Promise<T | null> {
  if (!kv) await connect()

  const result = await kv!.get<Uint8Array>(key)

  if (result.value == null) return null

  const value: T = JSON.parse(decoder.decode(result.value))

  return value
}
