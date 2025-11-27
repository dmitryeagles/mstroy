import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TableWrapper from './TableWrapper.vue'
import type { TreeItem } from '../types'

describe('TableWrapper', () => {
  const testItems: TreeItem[] = [
    { id: 1, parent: null, label: 'Айтем 1' },
    { id: 2, parent: 1, label: 'Айтем 2' }
  ]

  it('должен отображать обертку таблицы', () => {
    const wrapper = mount(TableWrapper, {
      props: {
        items: testItems
      }
    })

    expect(wrapper.find('.table-wrapper').exists()).toBe(true)
    expect(wrapper.find('.table-wrapper__header').exists()).toBe(true)
    expect(wrapper.find('.table-wrapper__content').exists()).toBe(true)
  })

  it('должен отображать режим просмотр по умолчанию', () => {
    const wrapper = mount(TableWrapper, {
      props: {
        items: testItems
      }
    })

    expect(wrapper.text()).toContain('Режим: просмотр')
  })

  it('должен отображать режим редактирование когда передан', () => {
    const wrapper = mount(TableWrapper, {
      props: {
        items: testItems,
        mode: 'edit'
      }
    })

    expect(wrapper.text()).toContain('Режим: редактирование')
  })

  it('должен передавать items в TreeTable', () => {
    const wrapper = mount(TableWrapper, {
      props: {
        items: testItems
      }
    })

    const treeTable = wrapper.findComponent({ name: 'TreeTable' })
    expect(treeTable.exists()).toBe(true)
    if (treeTable.exists()) {
      expect(treeTable.props('items')).toEqual(testItems)
    }
  })

  it('должен передавать mode в TreeTable', () => {
    const wrapper = mount(TableWrapper, {
      props: {
        items: testItems,
        mode: 'edit'
      }
    })

    const treeTable = wrapper.findComponent({ name: 'TreeTable' })
    if (treeTable.exists()) {
      expect(treeTable.props('mode')).toBe('edit')
    }
  })
})

