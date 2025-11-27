export interface TreeItem {
  id: number | string
  parent: number | string | null
  [key: string]: unknown
}

export type ItemId = number | string

export type ParentId = ItemId | null

