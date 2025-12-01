import type { TreeItem, ItemId } from './types'
import { TreeService } from './services/TreeService'

/**
 * @deprecated Рекомендуется использовать TreeService напрямую
 */
export class TreeStore {
  private service: TreeService<TreeItem>

  constructor(items: TreeItem[]) {
    this.service = new TreeService(items)
  }

  getAll(): TreeItem[] {
    return this.service.getAllItems()
  }

  getItem(id: ItemId): TreeItem | undefined {
    return this.service.getItem(id)
  }

  getChildren(id: ItemId): TreeItem[] {
    return this.service.getChildren(id)
  }

  getAllChildren(id: ItemId): TreeItem[] {
    return this.service.getAllChildren(id)
  }

  getAllParents(id: ItemId): TreeItem[] {
    return this.service.getAllParents(id)
  }

  addItem(item: TreeItem): void {
    this.service.addItem(item)
  }

  removeItem(id: ItemId): void {
    this.service.removeItem(id)
  }

  updateItem(item: TreeItem): void {
    this.service.updateItem(item)
  }
}

