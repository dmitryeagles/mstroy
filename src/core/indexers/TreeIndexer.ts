import type { TreeItem, ItemId, ParentId } from '../../types'
import type { ITreeIndexer } from '../interfaces'

export class TreeIndexer<T extends TreeItem> implements ITreeIndexer<T> {
  private childrenMap: Map<ParentId, T[]>
  private itemsMap: Map<ItemId, T>

  constructor(items: T[] = []) {
    this.itemsMap = new Map()
    this.childrenMap = new Map()
    this.rebuild(items)
  }

  getChildren(id: ItemId): T[] {
    return this.childrenMap.get(id) || []
  }

  getAllChildren(id: ItemId): T[] {
    const result: T[] = []
    const stack = [...this.getChildren(id)]

    while (stack.length > 0) {
      const item = stack.pop()!
      result.push(item)
      stack.push(...this.getChildren(item.id))
    }

    return result
  }

  getAllParents(id: ItemId): T[] {
    const result: T[] = []
    let currentId: ItemId | null = id

    while (currentId !== null) {
      const item = this.itemsMap.get(currentId)
      if (!item) break
      result.push(item)
      currentId = item.parent ?? null
    }

    return result
  }

  getRootItems(): T[] {
    return this.childrenMap.get(null) || []
  }

  rebuild(items: T[]): void {
    this.itemsMap.clear()
    this.childrenMap.clear()

    items.forEach(item => {
      this.itemsMap.set(item.id, item)
      const parentId: ParentId = item.parent ?? null
      if (!this.childrenMap.has(parentId)) {
        this.childrenMap.set(parentId, [])
      }
      this.childrenMap.get(parentId)!.push(item)
    })
  }

  addItem(item: T): void {
    this.itemsMap.set(item.id, item)
    const parentId: ParentId = item.parent ?? null
    if (!this.childrenMap.has(parentId)) {
      this.childrenMap.set(parentId, [])
    }
    this.childrenMap.get(parentId)!.push(item)
  }

  removeItem(id: ItemId): void {
    const item = this.itemsMap.get(id)
    if (!item) return

    const parentId: ParentId = item.parent ?? null
    const children = this.childrenMap.get(parentId)
    if (children) {
      const index = children.findIndex(i => i.id === id)
      if (index >= 0) {
        children.splice(index, 1)
      }
    }
    this.itemsMap.delete(id)
  }

  updateItem(item: T, oldParent: ParentId): void {
    this.itemsMap.set(item.id, item)
    const newParent: ParentId = item.parent ?? null

    if (oldParent !== newParent) {
      const oldChildren = this.childrenMap.get(oldParent)
      if (oldChildren) {
        const index = oldChildren.findIndex(i => i.id === item.id)
        if (index >= 0) {
          oldChildren.splice(index, 1)
        }
      }

      if (!this.childrenMap.has(newParent)) {
        this.childrenMap.set(newParent, [])
      }
      this.childrenMap.get(newParent)!.push(item)
    }
  }

  rebuildAfterBulkDelete(remainingItems: T[]): void {
    this.rebuild(remainingItems)
  }
}

