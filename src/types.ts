export interface TreeItem {
  id: number | string
  parent: number | string | null
  [key: string]: unknown
}

export type ItemId = number | string

export type ParentId = ItemId | null

/**
 * Режим работы таблицы
 */
export type TableMode = 'view' | 'edit'

/**
 * Props для компонентов таблицы
 */
export interface TableProps {
  items: TreeItem[]
  mode?: TableMode
}

/**
 * Строка данных для AG Grid
 */
export interface GridRow {
  id: ItemId
  category: string
  label: string
  path: string[]
  level: number
  hasChildren: boolean
  rowNumber?: number
}

