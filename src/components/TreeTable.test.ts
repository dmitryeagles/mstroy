import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TreeTable from './TreeTable.vue'
import type { TreeItem } from '../types'

vi.mock('ag-grid-vue3', async (importOriginal) => {
  const actual = await importOriginal<typeof import('ag-grid-vue3')>()
  return {
    ...actual,
    AgGridVue: {
      name: 'AgGridVue',
      template: '<div class="ag-grid-mock"></div>'
    }
  }
})

describe('TreeTable', () => {
  const testItems: TreeItem[] = [
    { id: 1, parent: null, label: 'Айтем 1' },
    { id: '91064cee', parent: 1, label: 'Айтем 2' },
    { id: 3, parent: 1, label: 'Айтем 3' },
    { id: 4, parent: '91064cee', label: 'Айтем 4' },
    { id: 5, parent: '91064cee', label: 'Айтем 5' },
    { id: 6, parent: '91064cee', label: 'Айтем 6' },
    { id: 7, parent: 4, label: 'Айтем 7' },
    { id: 8, parent: 4, label: 'Айтем 8' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('должен отображать таблицу с данными', () => {
    const wrapper = mount(TreeTable, {
      props: {
        items: testItems
      }
    })

    expect(wrapper.find('.tree-table-container').exists()).toBe(true)
  })

  it('должен принимать проп items', () => {
    const wrapper = mount(TreeTable, {
      props: {
        items: testItems
      }
    })

    expect(wrapper.props('items')).toEqual(testItems)
  })

  it('должен принимать проп mode', () => {
    const wrapper = mount(TreeTable, {
      props: {
        items: testItems,
        mode: 'view'
      }
    })

    expect(wrapper.props('mode')).toBe('view')
  })

  it('должен использовать режим edit когда передан', () => {
    const wrapper = mount(TreeTable, {
      props: {
        items: testItems,
        mode: 'edit'
      }
    })

    expect(wrapper.props('mode')).toBe('edit')
  })

  it('должен инициализировать компонент с данными', async () => {
    const wrapper = mount(TreeTable, {
      props: {
        items: testItems
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.tree-table-container').exists()).toBe(true)
  })

  it('должен отображать AgGrid компонент', () => {
    const wrapper = mount(TreeTable, {
      props: {
        items: testItems
      }
    })

    expect(wrapper.find('.ag-grid-mock').exists()).toBe(true)
  })
})
