import type { TreeItem, ItemId } from '../types'
import type { IRepository } from '../core/interfaces'

export class TreeRepository<T extends TreeItem> implements IRepository<T> {
  private items: Map<ItemId, T>

  constructor(items: T[] = []) {
    this.items = new Map()
    items.forEach(item => this.items.set(item.id, item))
  }

  findAll(): T[] {
    return Array.from(this.items.values())
  }

  findById(id: ItemId): T | undefined {
    return this.items.get(id)
  }

  save(item: T): void {
    if (this.items.has(item.id)) {
      throw new Error(`Элемент с id ${item.id} уже существует`)
    }
    this.items.set(item.id, item)
  }

  update(item: T): void {
    if (!this.items.has(item.id)) {
      throw new Error(`Элемент с id ${item.id} не найден`)
    }
    this.items.set(item.id, item)
  }

  delete(id: ItemId): void {
    this.items.delete(id)
  }

  exists(id: ItemId): boolean {
    return this.items.has(id)
  }

  reset(items: T[]): void {
    this.items.clear()
    items.forEach(item => this.items.set(item.id, item))
  }
}

