export interface Entry {
  id: string,
  title: string,
  createdAt: string,
  updatedAt: string,
  html: string,
  properties: Record<string, unknown>
}
