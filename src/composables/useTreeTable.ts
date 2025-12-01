import { ref, onMounted } from 'vue'
import type { TreeItem, GridRow } from '../types'
import { TreeServiceFactory } from '../factories/TreeServiceFactory'

export function useTreeTable<T extends TreeItem>(items: T[]) {
  const rowData = ref<GridRow[]>([])

  const initialize = () => {
    const treeService = TreeServiceFactory.createService(items)
    const indexer = TreeServiceFactory.createIndexer(items)
    const treeBuilder = TreeServiceFactory.createTreeBuilder(indexer, treeService)
    
    const data = treeBuilder.buildFlatTree(items)
    rowData.value = data
    return data
  }

  onMounted(() => {
    initialize()
  })

  return {
    rowData,
    initialize
  }
}

