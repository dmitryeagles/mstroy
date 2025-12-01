import type { TreeItem, ItemId, ParentId } from '../types'
import type { ITreeService } from '../core/interfaces'
import { TreeRepository } from '../repositories/TreeRepository'
import { TreeIndexer } from '../core/indexers/TreeIndexer'

export class TreeService<T extends TreeItem> implements ITreeService<T> {
  private repository: TreeRepository<T>
  private indexer: TreeIndexer<T>

  constructor(items: T[] = []) {
    this.repository = new TreeRepository(items)
    this.indexer = new TreeIndexer(items)
  }

  getAllItems(): T[] {
    return this.repository.findAll()
  }

  getItem(id: ItemId): T | undefined {
    return this.repository.findById(id)
  }

  getChildren(id: ItemId): T[] {
    return this.indexer.getChildren(id)
  }

  getAllChildren(id: ItemId): T[] {
    return this.indexer.getAllChildren(id)
  }

  getAllParents(id: ItemId): T[] {
    return this.indexer.getAllParents(id)
  }

  addItem(item: T): void {
    this.validateItem(item)
    this.repository.save(item)
    this.indexer.addItem(item)
  }

  updateItem(item: T): void {
    const existingItem = this.repository.findById(item.id)
    if (!existingItem) {
      throw new Error(`Элемент с id ${item.id} не найден`)
    }

    this.validateItem(item)
    const oldParent: ParentId = existingItem.parent ?? null
    this.repository.update(item)
    this.indexer.updateItem(item, oldParent)
  }

  removeItem(id: ItemId): void {
    if (!this.repository.exists(id)) {
      return
    }

    const allChildren = this.indexer.getAllChildren(id)
    const idsToRemove = [id, ...allChildren.map(c => c.id)]

    idsToRemove.forEach(itemId => {
      this.repository.delete(itemId)
    })

    const remainingItems = this.repository.findAll()
    this.indexer.rebuildAfterBulkDelete(remainingItems)
  }

  validateItem(item: T): void {
    if (!item.id) {
      throw new Error('Элемент должен иметь id')
    }

    if (item.parent !== null && item.parent !== undefined) {
      const parents = this.indexer.getAllParents(item.parent as ItemId)
      if (parents.some(p => p.id === item.id)) {
        throw new Error(`Обнаружена циклическая ссылка: элемент ${item.id} не может быть родителем для ${item.parent}`)
      }
    }
  }

  reset(items: T[]): void {
    this.repository.reset(items)
    this.indexer.rebuild(items)
  }
}

