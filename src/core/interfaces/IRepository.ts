import type { TreeItem, ItemId } from '../../types'

export interface IRepository<T extends TreeItem> {
  findAll(): T[]
  findById(id: ItemId): T | undefined
  save(item: T): void
  update(item: T): void
  delete(id: ItemId): void
  exists(id: ItemId): boolean
}

