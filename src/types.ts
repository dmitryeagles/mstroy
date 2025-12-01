export interface TreeItem {
  id: number | string
  parent: number | string | null
  [key: string]: unknown
}

export type ItemId = number | string

export type ParentId = ItemId | null

export type TableMode = 'view' | 'edit'

export interface TableProps {
  items: TreeItem[]
  mode?: TableMode
}

export interface GridRow {
  id: ItemId
  category: string
  label: string
  path: string[]
  level: number
  hasChildren: boolean
  rowNumber?: number
}

