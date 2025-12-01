<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { TreeServiceFactory } from '../factories/TreeServiceFactory'
import { AgGridAdapter } from '../adapters/AgGridAdapter'
import type { TableProps, GridRow } from '../types'

const props = withDefaults(defineProps<TableProps>(), {
  mode: 'view'
})

const rowData = ref<GridRow[]>([])

const getRowId = AgGridAdapter.getRowId
const getDataPath = AgGridAdapter.getDataPath
const columnDefs = computed(() => AgGridAdapter.getColumnDefs())
const defaultColDef = computed(() => AgGridAdapter.getDefaultColDef())
const autoGroupColumnDef = computed(() => AgGridAdapter.getAutoGroupColumnDef())
const groupDefaultExpanded = -1

onMounted(() => {
  const treeService = TreeServiceFactory.createService(props.items)
  const indexer = TreeServiceFactory.createIndexer(props.items)
  const treeBuilder = TreeServiceFactory.createTreeBuilder(indexer, treeService)
  
  const data = treeBuilder.buildFlatTree(props.items)
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

