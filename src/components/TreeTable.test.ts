import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TreeTable from './TreeTable.vue'

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

import { mockTreeItems } from '../mocks'
import type { TreeItem } from '../types'

describe('TreeTable', () => {
  const testItems: TreeItem[] = [...mockTreeItems]

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
