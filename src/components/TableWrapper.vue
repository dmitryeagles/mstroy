<script setup lang="ts">
import { computed } from 'vue'
import TreeTable from './TreeTable.vue'
import type { TreeItem } from '../types'

interface Props {
  items: TreeItem[]
  mode?: 'view' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'view'
})

const modeLabel = computed(() => {
  return props.mode === 'view' ? 'просмотр' : 'редактирование'
})
</script>

<template>
  <div class="table-wrapper">
    <div class="table-wrapper__header">
      <span class="table-wrapper__mode">Режим: {{ modeLabel }}</span>
    </div>
    <div class="table-wrapper__content">
      <TreeTable :items="items" :mode="mode" />
    </div>
  </div>
</template>

<style scoped>
.table-wrapper {
  width: 100%;
  background-color: #f5f5f5;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.table-wrapper__header {
  margin-bottom: 1rem;
  font-size: 14px;
  color: #666;
  flex-shrink: 0;
}

.table-wrapper__mode {
  font-weight: 500;
  color: #4a4adf;
}

.table-wrapper__content {
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 400px;
}
</style>

