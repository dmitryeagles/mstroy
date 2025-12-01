import type { TreeItem } from '../types'
import { TreeService } from '../services/TreeService'
import { TreeIndexer } from '../core/indexers/TreeIndexer'
import { DefaultTreeBuilder } from '../strategies/DefaultTreeBuilder'
import type { ITreeService, ITreeBuilder, ITreeIndexer } from '../core/interfaces'

export class TreeServiceFactory {
  static createService<T extends TreeItem>(items: T[] = []): ITreeService<T> {
    return new TreeService(items)
  }

  static createTreeBuilder<T extends TreeItem>(
    indexer: ITreeIndexer<T>,
    service: ITreeService<T>
  ): ITreeBuilder<T> {
    return new DefaultTreeBuilder(indexer, service)
  }

  static createIndexer<T extends TreeItem>(items: T[] = []): ITreeIndexer<T> {
    return new TreeIndexer(items)
  }
}

