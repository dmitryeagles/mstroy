import type { TreeItem, ItemId, ParentId } from './types'

export class TreeStore {
  private items: TreeItem[]
  private itemsMap: Map<ItemId, TreeItem>
  private childrenMap: Map<ParentId, TreeItem[]>

  constructor(items: TreeItem[]) {
    this.items = [...items]
    this.itemsMap = new Map()
    this.childrenMap = new Map()

    for (const item of items) {
      this.itemsMap.set(item.id, item)
      const parentId: ParentId = item.parent ?? null
      if (!this.childrenMap.has(parentId)) {
        this.childrenMap.set(parentId, [])
      }
      this.childrenMap.get(parentId)!.push(item)
    }
  }

  getAll(): TreeItem[] {
    return [...this.items]
  }

  getItem(id: ItemId): TreeItem | undefined {
    return this.itemsMap.get(id)
  }

  getChildren(id: ItemId): TreeItem[] {
    return this.childrenMap.get(id) || []
  }

  getAllChildren(id: ItemId): TreeItem[] {
    const result: TreeItem[] = []
    const stack = [...this.getChildren(id)]

    while (stack.length > 0) {
      const item = stack.pop()!
      result.push(item)
      stack.push(...this.getChildren(item.id))
    }

    return result
  }

  getAllParents(id: ItemId): TreeItem[] {
    const result: TreeItem[] = []
    let currentId: ItemId | null = id

    while (currentId !== null) {
      const item = this.itemsMap.get(currentId)
      if (!item) break
      result.push(item)
      currentId = item.parent ?? null
    }

    return result
  }

  addItem(item: TreeItem): void {
    if (this.itemsMap.has(item.id)) {
      throw new Error(`Элемент с id ${item.id} уже существует`)
    }

    this.items.push(item)
    this.itemsMap.set(item.id, item)
    const parentId: ParentId = item.parent ?? null
    if (!this.childrenMap.has(parentId)) {
      this.childrenMap.set(parentId, [])
    }
    this.childrenMap.get(parentId)!.push(item)
  }

  removeItem(id: ItemId): void {
    if (!this.itemsMap.has(id)) return

    const allChildren = this.getAllChildren(id)
    const idsToRemove = new Set([id, ...allChildren.map(c => c.id)])

    this.items = this.items.filter(i => !idsToRemove.has(i.id))
    idsToRemove.forEach(id => this.itemsMap.delete(id))

    this.childrenMap.clear()
    this.items.forEach(item => {
      const pid: ParentId = item.parent ?? null
      if (!this.childrenMap.has(pid)) {
        this.childrenMap.set(pid, [])
      }
      this.childrenMap.get(pid)!.push(item)
    })
  }

  updateItem(item: TreeItem): void {
    if (!this.itemsMap.has(item.id)) {
      throw new Error(`Элемент с id ${item.id} не найден`)
    }

    const oldItem = this.itemsMap.get(item.id)!
    const oldParent = oldItem.parent ?? null
    const newParent = item.parent ?? null

    const idx = this.items.findIndex(i => i.id === item.id)
    if (idx >= 0) {
      this.items[idx] = item
    }

    this.itemsMap.set(item.id, item)

    if (oldParent !== newParent) {
      const oldChildren = this.childrenMap.get(oldParent as ParentId)
      if (oldChildren) {
        const oldIdx = oldChildren.findIndex(i => i.id === item.id)
        if (oldIdx >= 0) {
          oldChildren.splice(oldIdx, 1)
        }
      }

      const newParentId: ParentId = newParent
      if (!this.childrenMap.has(newParentId)) {
        this.childrenMap.set(newParentId, [])
      }
      this.childrenMap.get(newParentId)!.push(item)
    }
  }
}

