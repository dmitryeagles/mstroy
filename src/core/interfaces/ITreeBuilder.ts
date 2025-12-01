import type { TreeItem, GridRow } from '../../types'

export interface ITreeBuilder<T extends TreeItem> {
  buildFlatTree(items: T[]): GridRow[]
  getNodeType(item: T, children: T[]): string
}

