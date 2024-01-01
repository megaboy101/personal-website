import { getPage, getPageHtml } from '@/notion.ts'
import * as S from '@/notebook/section.ts'


/**
 * A labeled group of notes
 */
export type Section = {
  title: string,
  notes: NoteSummary[]
}

/**
 * Surface level details about a note.
 */
export type NoteSummary = {
  id: string,
  title: string,
  createdAt: string,
  updatedAt: string,
}

/**
 * A full note
 */
export type Note = {
  id: string,
  title: string,
  createdAt: string
  updatedAt: string
  html: string
}


// Connection to Deno KV
let kv: Deno.Kv | null

// This is a hard-coded page ID corresponding
// to the "Blog" page in my notion
const SECTIONS_PAGE_ID = 'dc4d0731cf0a4fcc93c9c93de9c8927a'

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
 * Fetches a list of notes grouped by section
 */
export async function getSections() {
  return await load<Section[]>(['sections'])
}


/**
 * Fetches the full content of a single note
 */
export async function getNote(id: string) {
  return await load<Note>(['note', id])
}


/**
 * Sync notes from Notion into local KV storage
 */
export async function sync() {
  console.log('Syncing all notes from notion')

  console.log('Syncing directory')
  const sections = await syncSections()

  const noteSummaries = sections.flatMap(s => s.notes)
  const noteTasks = noteSummaries.map(s => syncNote(s))

  await Promise.allSettled(noteTasks)
}


/**
 * Removes all data from KV storage
 */
export async function clear() {
  const rows = kv?.list({ prefix: [] });

  if (!rows) return null

  for await (const row of rows) {
    await kv?.delete(row.key);
  }
}


async function syncSections() {
  const sectionPageBlocks = await getPage(SECTIONS_PAGE_ID)
  const sections = S.fromNotionBlocks(sectionPageBlocks)
  await saveSections(sections)

  return sections
}

async function syncNote({ id, title, updatedAt, createdAt }: NoteSummary) {
  // Only sync a note if it doesn't exist, or if it has been
  // updated since we last synced
  if (await getNote(id) == null || withinLastDay(new Date(updatedAt))) {
    console.log(`Syncing note [${title}], was last updated at: [${updatedAt}]`)

    const html = await getPageHtml(id)

    const note: Note = {
      id,
      title,
      createdAt,
      updatedAt,
      html
    }

    await saveNote(note)

    return note
  }
}

async function saveSections(sections: Section[]) {
  return await save(['sections'], sections)
}

async function saveNote(note: Note) {
  return await save(['note', note.id], note)
}

async function save(key: Deno.KvKey, value: unknown) {
  if (!kv) throw new Error('Not connected to notebook')

  // We serialize data to a UTF-8 string instead of the default
  // UTF-16 format because it's more space efficient, and Deno
  // KV has a string 64KB limit on value size
  const valueStr = JSON.stringify(value)
  const valueBin = encoder.encode(valueStr)

  return await kv.set(key, valueBin)
}

async function load<T>(key: Deno.KvKey) {
  if (!kv) throw new Error('Not connected to notebook')

  const result = await kv.get<Uint8Array>(key)

  if (result.value == null) return null

  const value: T = JSON.parse(decoder.decode(result.value))

  return value
}

function withinLastDay(date: Date) {
  const oneDayAgo = new Date().getTime() - (24 * 60 * 60 * 1000)
  const updatedAt = date.getTime()
  return updatedAt > oneDayAgo
}
