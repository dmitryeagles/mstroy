import { createApp } from 'vue'
import App from './App.vue'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import './styles/ag-grid-overrides.css'

const originalWarn = console.warn
console.warn = (...args: any[]) => {
  const msg = String(args[0] || '')
  if (msg.includes('AG Grid') || msg.includes('Enterprise') || msg.includes('License')) {
    return
  }
  originalWarn.apply(console, args)
}

import 'ag-grid-enterprise'

createApp(App).mount('#app')

