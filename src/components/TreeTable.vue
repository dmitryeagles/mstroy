<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { TreeStore } from '../TreeStore'
import type { TreeItem, ItemId } from '../types'
import type { ColDef } from 'ag-grid-community'

interface Props {
  items: TreeItem[]
  mode?: 'view' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'view'
})

let treeStore: TreeStore

interface GridRow {
  id: ItemId
  category: string
  label: string
  path: string[]
  level: number
  hasChildren: boolean
  rowNumber?: number
}

const rowData = ref<GridRow[]>([])

const getRowId = (params: any) => String(params.data.id)

const getDataPath = (data: GridRow) => data.path

const buildFlatTree = (store: TreeStore): GridRow[] => {
  const result: GridRow[] = []
  const seen = new Set<ItemId>()

  const walk = (id: ItemId, path: string[] = []) => {
    if (seen.has(id)) return
    const item = store.getItem(id)
    if (!item) return

    seen.add(id)
    const kids = store.getChildren(id)
    const newPath = [...path, String(id)]

    result.push({
      id: item.id,
      category: kids.length > 0 ? 'Группа' : 'Элемент',
      label: (item.label as string) || String(item.id),
      path: newPath,
      level: path.length,
      hasChildren: kids.length > 0
    })

    kids.forEach(child => walk(child.id, newPath))
  }

  store.getAll()
    .filter(item => item.parent === null)
    .forEach(item => walk(item.id, []))

  result.forEach((r, i) => {
    r.rowNumber = i + 1
  })

  return result
}

const columnDefs = computed<ColDef[]>(() => [
  {
    headerName: '№ п/п',
    width: 100,
    cellRenderer: (params: any) => params.node.rowIndex + 1,
    sortable: false,
    filter: false,
    pinned: 'left',
    suppressMovable: true,
    lockPosition: true
  },
  {
    headerName: 'Наименование',
    field: 'label',
    flex: 1,
    sortable: false,
    filter: false,
    suppressMovable: true
  }
])

const defaultColDef: ColDef = {
  resizable: false,
  sortable: false,
  filter: false
}

const autoGroupColumnDef: ColDef = {
  headerName: 'Категория',
  field: 'category',
  width: 300,
  cellRenderer: 'agGroupCellRenderer',
  cellRendererParams: {
    suppressCount: true,
    innerRenderer: (params: any) => {
      if (!params.data) return ''
      const text = params.data.category === 'Группа' ? 'Группа' : 'Элемент'
      const span = document.createElement('span')
      span.className = 'ag-group-value-custom'
      span.setAttribute('data-level', String(params.node?.level || 0))
      span.textContent = text
      return span
    }
  },
  sortable: false,
  filter: false,
  suppressMovable: true,
  lockPosition: true
}

const groupDefaultExpanded = -1

onMounted(() => {
  treeStore = new TreeStore(props.items)
  const data = buildFlatTree(treeStore)
  rowData.value = data
  console.log('TreeTable data:', data)
})
</script>

<template>
  <div class="tree-table-container">
    <ag-grid-vue
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :treeData="true"
      :getDataPath="getDataPath"
      :groupDefaultExpanded="groupDefaultExpanded"
      :autoGroupColumnDef="autoGroupColumnDef"
      :rowGroupPanelShow="'never'"
      :suppressRowClickSelection="true"
      :animateRows="true"
      :enableRangeSelection="false"
      :enableCharts="false"
      :suppressAggFuncInHeader="true"
      :rowSelection="'single'"
      :getRowId="getRowId"
    />
  </div>
</template>

<style scoped>
.tree-table-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.tree-table-container :deep(.ag-theme-alpine) {
  width: 100%;
  height: 100%;
  --ag-header-background-color: #f8f9fa;
  --ag-header-foreground-color: #212529;
  --ag-border-color: #dee2e6;
  --ag-row-hover-color: #f5f5f5;
}

.tree-table-container :deep(.ag-row-group) {
  font-weight: 500;
}

.tree-table-container :deep(.ag-group-cell) {
  font-weight: 500;
}

.tree-table-container :deep(.ag-ltr .ag-group-cell.ag-row-group-indent-1),
.tree-table-container :deep(.ag-ltr .ag-group-cell.ag-row-group-indent-2),
.tree-table-container :deep(.ag-ltr .ag-group-cell.ag-row-group-indent-3),
.tree-table-container :deep(.ag-ltr .ag-group-cell.ag-row-group-indent-4),
.tree-table-container :deep(.ag-ltr .ag-group-cell.ag-row-group-indent-5) {
  padding-left: 0 !important;
}

.tree-table-container :deep(.ag-header-cell[col-id*="ag-Grid-AutoColumn"]) {
  border-right: 1px solid #dee2e6 !important;
}

</style>

