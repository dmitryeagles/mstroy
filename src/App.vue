<script setup lang="ts">
import { ref } from 'vue'
import TableWrapper from './components/TableWrapper.vue'
import type { TreeItem } from './types'

const items = ref<TreeItem[]>([
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '91064cee', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '91064cee', label: 'Айтем 4' },
  { id: 5, parent: '91064cee', label: 'Айтем 5' },
  { id: 6, parent: '91064cee', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' }
])

const mode = ref<'view' | 'edit'>('view')
</script>

<template>
  <div id="app">
    <TableWrapper :items="items" :mode="mode" />
  </div>
</template>

<style>
#app {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
</style>

