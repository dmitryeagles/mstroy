import type { TreeItem, ItemId } from '../../types'

export interface ITreeService<T extends TreeItem> {
  getAllItems(): T[]
  getItem(id: ItemId): T | undefined
  getChildren(id: ItemId): T[]
  getAllChildren(id: ItemId): T[]
  getAllParents(id: ItemId): T[]
  addItem(item: T): void
  updateItem(item: T): void
  removeItem(id: ItemId): void
  validateItem(item: T): void
}

