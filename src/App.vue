<script setup lang="ts">
import { ref } from 'vue'
import { TableWrapper } from './components'
import { mockTreeItems } from './mocks'
import type { TreeItem, TableMode } from './types'

const items = ref<TreeItem[]>([...mockTreeItems])

const mode = ref<TableMode>('view')
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

