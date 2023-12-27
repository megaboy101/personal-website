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



let kv: Deno.Kv | null

// This is a hard-coded page ID corresponding
// to the "Blog" page in my notion
const SECTIONS_PAGE_ID = 'dc4d0731cf0a4fcc93c9c93de9c8927a'

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
  const result = await kv?.get<Section[]>(['sections']) ?? null

  return result?.value ?? null
}


/**
 * Fetches the full content of a single note
 */
export async function getNote(id: string) {
  const result = await kv?.get<Note>(['note', id]) ?? null

  return result?.value ?? null
}


/**
 * Sync notes from Notion into local KV storage
 */
export async function sync() {
  console.log('Syncing all notes from notion')

  console.log('Syncing directory page')
  const sections = await syncSections()

  const noteSummaries = sections.flatMap(s => s.notes)
  const noteTasks = noteSummaries.map(s => syncNote(s))

  console.log('Syncing content pages')
  await Promise.allSettled(noteTasks)
}

async function syncSections() {
  const sectionPageBlocks = await getPage(SECTIONS_PAGE_ID)
  const sections = S.fromNotionBlocks(sectionPageBlocks)
  await saveSections(sections)

  return sections
}

async function syncNote(summary: NoteSummary) {
  const notePageHtml = await getPageHtml(summary.id)
  const note: Note = {
    id: summary.id,
    title: summary.title,
    createdAt: summary.createdAt,
    updatedAt: summary.updatedAt,
    html: notePageHtml
  }

  await saveNote(note)

  return note
}

async function saveSections(sections: Section[]) {
  await save(['sections'], sections)
}

async function saveNote(note: Note) {
  await save(['note', note.id], note)
}

async function save(key: Deno.KvKey, value: any) {
  if (!kv) throw new Error('Not connected to notebook')
  await kv.set(key, value)
}
