import type { TreeItem, ItemId, GridRow } from '../types'
import type { ITreeBuilder } from '../core/interfaces'
import type { ITreeIndexer, ITreeService } from '../core/interfaces'

export class DefaultTreeBuilder<T extends TreeItem> implements ITreeBuilder<T> {
  private indexer: ITreeIndexer<T>
  private service: ITreeService<T>

  constructor(indexer: ITreeIndexer<T>, service: ITreeService<T>) {
    this.indexer = indexer
    this.service = service
  }

  buildFlatTree(_items: T[]): GridRow[] {
    const result: GridRow[] = []
    const seen = new Set<ItemId>()

    const walk = (id: ItemId, path: string[] = []) => {
      if (seen.has(id)) return
      
      const item = this.service.getItem(id)
      if (!item) return

      seen.add(id)
      const children = this.indexer.getChildren(id)
      const newPath = [...path, String(id)]

      result.push({
        id: item.id,
        category: this.getNodeType(item, children),
        label: (item.label as string) || String(item.id),
        path: newPath,
        level: path.length,
        hasChildren: children.length > 0
      })

      children.forEach(child => walk(child.id, newPath))
    }

    this.indexer.getRootItems().forEach(item => walk(item.id, []))

    result.forEach((r, i) => {
      r.rowNumber = i + 1
    })

    return result
  }

  getNodeType(_item: T, children: T[]): string {
    return children.length > 0 ? 'Группа' : 'Элемент'
  }
}

