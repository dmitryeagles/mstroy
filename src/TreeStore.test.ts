import { describe, it, expect, beforeEach } from 'vitest'
import { TreeStore } from './TreeStore'
import type { TreeItem } from './types'

describe('TreeStore', () => {
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

  let store: TreeStore

  beforeEach(() => {
    store = new TreeStore([...testItems])
  })

  describe('getAll', () => {
    it('должен возвращать изначальный массив элементов', () => {
      const result = store.getAll()
      expect(result).toHaveLength(8)
      expect(result).toEqual(testItems)
    })

    it('должен возвращать копию массива, а не ссылку', () => {
      const result1 = store.getAll()
      const result2 = store.getAll()
      expect(result1).not.toBe(result2)
    })
  })

  describe('getItem', () => {
    it('должен возвращать элемент по числовому id', () => {
      const result = store.getItem(1)
      expect(result).toEqual(testItems[0])
    })

    it('должен возвращать элемент по строковому id', () => {
      const result = store.getItem('91064cee')
      expect(result).toEqual(testItems[1])
    })

    it('должен возвращать undefined для несуществующего id', () => {
      const result = store.getItem(999)
      expect(result).toBeUndefined()
    })
  })

  describe('getChildren', () => {
    it('должен возвращать прямых дочерних элементов', () => {
      const result = store.getChildren(1)
      expect(result).toHaveLength(2)
      expect(result.map(r => r.id)).toContain('91064cee')
      expect(result.map(r => r.id)).toContain(3)
    })

    it('должен возвращать пустой массив для элемента без дочерних', () => {
      const result = store.getChildren(7)
      expect(result).toHaveLength(0)
    })

    it('должен возвращать пустой массив для несуществующего элемента', () => {
      const result = store.getChildren(999)
      expect(result).toHaveLength(0)
    })

    it('должен возвращать дочерних для строкового id', () => {
      const result = store.getChildren('91064cee')
      expect(result).toHaveLength(3)
      expect(result.map(r => r.id)).toContain(4)
      expect(result.map(r => r.id)).toContain(5)
      expect(result.map(r => r.id)).toContain(6)
    })
  })

  describe('getAllChildren', () => {
    it('должен возвращать все дочерние элементы рекурсивно', () => {
      const result = store.getAllChildren(1)
      expect(result).toHaveLength(7)
      const ids = result.map(r => r.id)
      expect(ids).toContain('91064cee')
      expect(ids).toContain(3)
      expect(ids).toContain(4)
      expect(ids).toContain(5)
      expect(ids).toContain(6)
      expect(ids).toContain(7)
      expect(ids).toContain(8)
    })

    it('должен возвращать все дочерние элементы для вложенного элемента', () => {
      const result = store.getAllChildren(4)
      expect(result).toHaveLength(2)
      expect(result.map(r => r.id)).toContain(7)
      expect(result.map(r => r.id)).toContain(8)
    })

    it('должен возвращать пустой массив для элемента без дочерних', () => {
      const result = store.getAllChildren(7)
      expect(result).toHaveLength(0)
    })

    it('должен возвращать все дочерние для строкового id', () => {
      const result = store.getAllChildren('91064cee')
      expect(result).toHaveLength(5)
      const ids = result.map(r => r.id)
      expect(ids).toContain(4)
      expect(ids).toContain(5)
      expect(ids).toContain(6)
      expect(ids).toContain(7)
      expect(ids).toContain(8)
    })
  })

  describe('getAllParents', () => {
    it('должен возвращать цепочку родителей от элемента до корня', () => {
      const result = store.getAllParents(7)
      expect(result).toHaveLength(4)
      expect(result[0].id).toBe(7)
      expect(result[1].id).toBe(4)
      expect(result[2].id).toBe('91064cee')
      expect(result[3].id).toBe(1)
    })

    it('должен возвращать только сам элемент для корневого элемента', () => {
      const result = store.getAllParents(1)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(1)
    })

    it('должен возвращать правильную цепочку для элемента с числовым и строковым id', () => {
      const result = store.getAllParents(8)
      expect(result).toHaveLength(4)
      expect(result[0].id).toBe(8)
      expect(result[1].id).toBe(4)
      expect(result[2].id).toBe('91064cee')
      expect(result[3].id).toBe(1)
    })

    it('должен возвращать пустой массив для несуществующего элемента', () => {
      const result = store.getAllParents(999)
      expect(result).toHaveLength(0)
    })
  })

  describe('addItem', () => {
    it('должен добавлять новый элемент', () => {
      const newItem: TreeItem = { id: 9, parent: 1, label: 'Айтем 9' }
      store.addItem(newItem)

      expect(store.getItem(9)).toEqual(newItem)
      expect(store.getChildren(1)).toHaveLength(3)
      expect(store.getAll()).toHaveLength(9)
    })

    it('должен добавлять элемент с null parent', () => {
      const newItem: TreeItem = { id: 10, parent: null, label: 'Айтем 10' }
      store.addItem(newItem)

      expect(store.getItem(10)).toEqual(newItem)
      expect(store.getAll()).toHaveLength(9)
    })

    it('должен выбрасывать ошибку при добавлении элемента с существующим id', () => {
      const newItem: TreeItem = { id: 1, parent: null, label: 'Дубликат' }
      expect(() => store.addItem(newItem)).toThrow('Элемент с id 1 уже существует')
    })
  })

  describe('removeItem', () => {
    it('должен удалять элемент и всех его дочерних', () => {
      store.removeItem(4)

      expect(store.getItem(4)).toBeUndefined()
      expect(store.getItem(7)).toBeUndefined()
      expect(store.getItem(8)).toBeUndefined()
      expect(store.getAll()).toHaveLength(5)
    })

    it('должен удалять элемент с множеством вложенных дочерних', () => {
      store.removeItem(1)

      expect(store.getItem(1)).toBeUndefined()
      expect(store.getItem('91064cee')).toBeUndefined()
      expect(store.getItem(3)).toBeUndefined()
      expect(store.getItem(4)).toBeUndefined()
      expect(store.getAll()).toHaveLength(0)
    })

    it('должен корректно обрабатывать удаление несуществующего элемента', () => {
      const initialLength = store.getAll().length
      store.removeItem(999)
      expect(store.getAll()).toHaveLength(initialLength)
    })

    it('должен обновлять карту дочерних элементов после удаления', () => {
      store.removeItem(4)
      expect(store.getChildren('91064cee')).toHaveLength(2)
    })
  })

  describe('updateItem', () => {
    it('должен обновлять элемент', () => {
      const updatedItem: TreeItem = { id: 1, parent: null, label: 'Обновленный Айтем 1' }
      store.updateItem(updatedItem)

      const result = store.getItem(1)
      expect(result?.label).toBe('Обновленный Айтем 1')
    })

    it('должен обновлять родителя элемента', () => {
      const updatedItem: TreeItem = { id: 3, parent: '91064cee', label: 'Айтем 3' }
      store.updateItem(updatedItem)

      expect(store.getChildren(1)).toHaveLength(1)
      expect(store.getChildren('91064cee')).toHaveLength(4)
      expect(store.getItem(3)?.parent).toBe('91064cee')
    })

    it('должен выбрасывать ошибку при обновлении несуществующего элемента', () => {
      const updatedItem: TreeItem = { id: 999, parent: null, label: 'Несуществующий' }
      expect(() => store.updateItem(updatedItem)).toThrow('Элемент с id 999 не найден')
    })

    it('должен корректно обрабатывать изменение родителя на null', () => {
      const updatedItem: TreeItem = { id: 3, parent: null, label: 'Айтем 3' }
      store.updateItem(updatedItem)

      expect(store.getItem(3)?.parent).toBeNull()
      expect(store.getChildren(1)).toHaveLength(1)
    })
  })

  describe('Производительность', () => {
    it('должен быстро работать с большим количеством элементов', () => {
      const largeItems: TreeItem[] = []
      for (let i = 0; i < 1000; i++) {
        largeItems.push({
          id: i,
          parent: i > 0 ? Math.floor(Math.random() * i) : null,
          label: `Item ${i}`
        })
      }

      const largeStore = new TreeStore(largeItems)
      const start = performance.now()

      for (let i = 0; i < 100; i++) {
        largeStore.getItem(Math.floor(Math.random() * 1000))
        largeStore.getChildren(Math.floor(Math.random() * 1000))
        largeStore.getAllChildren(Math.floor(Math.random() * 1000))
      }

      const end = performance.now()
      const duration = end - start
      expect(duration).toBeLessThan(100)
    })
  })
})

