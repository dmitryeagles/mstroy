import type { TreeItem, ItemId } from '../../types'

export interface ITreeIndexer<T extends TreeItem> {
  getChildren(id: ItemId): T[]
  getAllChildren(id: ItemId): T[]
  getAllParents(id: ItemId): T[]
  getRootItems(): T[]
  rebuild(items: T[]): void
}

