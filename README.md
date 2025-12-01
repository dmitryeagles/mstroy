# Тестовое задание MStroy Frontend

Реализация тестового задания для позиции Frontend Developer / Vue.js

## Описание

Проект содержит:
- Класс `TreeStore` на TypeScript для работы с древовидной структурой данных
- Vue-компонент с AgGrid Enterprise для визуализации дерева в таблице
- Unit-тесты для класса TreeStore

## Установка

```bash
npm install
```

## Запуск

### Разработка
```bash
npm run dev
```

### Сборка
```bash
npm run build
```

### Тесты
```bash
npm run test
```

### Тесты с покрытием
```bash
npm run test:coverage
```

## Структура проекта

```
src/
├── core/                      # Ядро приложения
│   ├── interfaces/           # Интерфейсы и абстракции
│   │   ├── IRepository.ts    # Интерфейс репозитория
│   │   ├── ITreeService.ts   # Интерфейс сервиса дерева
│   │   ├── ITreeIndexer.ts   # Интерфейс индексатора
│   │   └── ITreeBuilder.ts   # Интерфейс построителя дерева
│   └── indexers/             # Индексация данных
│       └── TreeIndexer.ts    # Индексатор дерева
├── repositories/              # Слой доступа к данным
│   └── TreeRepository.ts     # Репозиторий для работы с данными
├── services/                  # Бизнес-логика
│   └── TreeService.ts        # Сервис для работы с деревом
├── strategies/                # Паттерн Strategy
│   └── DefaultTreeBuilder.ts # Построитель дерева
├── adapters/                  # Паттерн Adapter
│   └── AgGridAdapter.ts      # Адаптер для AG Grid
├── factories/                 # Паттерн Factory
│   └── TreeServiceFactory.ts # Фабрика сервисов
├── composables/               # Vue Composables
│   └── useTreeTable.ts       # Composable для таблицы
├── TreeStore.ts              # Фасад для обратной совместимости
├── TreeStore.test.ts         # Unit-тесты
├── types.ts                  # TypeScript типы
├── main.ts                   # Точка входа
├── App.vue                   # Главный компонент
└── components/
    ├── TreeTable.vue         # Компонент таблицы
    └── TableWrapper.vue      # Обертка таблицы
```

## Архитектура и принципы проектирования

### SOLID принципы

1. **Single Responsibility Principle (SRP)**
   - `TreeRepository` - только работа с данными
   - `TreeIndexer` - только индексация и поиск
   - `TreeService` - только бизнес-логика
   - `AgGridAdapter` - только адаптация данных для AG Grid

2. **Open/Closed Principle (OCP)**
   - Интерфейсы позволяют расширять функциональность без изменения существующего кода
   - Новые стратегии построения дерева можно добавлять через `ITreeBuilder`

3. **Liskov Substitution Principle (LSP)**
   - Все реализации интерфейсов полностью взаимозаменяемы

4. **Interface Segregation Principle (ISP)**
   - Интерфейсы разделены по назначению: `IRepository`, `ITreeIndexer`, `ITreeService`, `ITreeBuilder`

5. **Dependency Inversion Principle (DIP)**
   - Компоненты зависят от абстракций (интерфейсов), а не от конкретных реализаций
   - Использование Dependency Injection через фабрику

### Паттерны проектирования

1. **Repository Pattern** (`TreeRepository`)
   - Абстракция доступа к данным
   - Централизация логики работы с хранилищем

2. **Strategy Pattern** (`DefaultTreeBuilder`, `ITreeBuilder`)
   - Различные способы построения дерева
   - Легко добавлять новые стратегии

3. **Factory Pattern** (`TreeServiceFactory`)
   - Инкапсуляция логики создания объектов
   - Упрощение создания сложных зависимостей

4. **Adapter Pattern** (`AgGridAdapter`)
   - Изоляция логики работы с AG Grid
   - Упрощение интеграции внешней библиотеки

5. **Facade Pattern** (`TreeStore`)
   - Упрощенный интерфейс для обратной совместимости
   - Скрывает сложность внутренней архитектуры

### Особенности реализации

- **Разделение ответственности**: Каждый класс отвечает за одну задачу
- **Тестируемость**: Все компоненты легко тестируются благодаря интерфейсам
- **Расширяемость**: Легко добавлять новые реализации через интерфейсы
- **Производительность**: Использует `Map` для O(1) доступа к элементам
- **Типобезопасность**: Полная типизация на TypeScript

### API

#### TreeService (рекомендуемый способ)

```typescript
const service = TreeServiceFactory.createService(items)

service.getAllItems()      // Все элементы
service.getItem(id)        // Элемент по id
service.getChildren(id)    // Прямые потомки
service.getAllChildren(id) // Все потомки рекурсивно
service.getAllParents(id)  // Все предки до корня
service.addItem(item)      // Добавить элемент
service.updateItem(item)   // Обновить элемент
service.removeItem(id)     // Удалить элемент и потомков
```

#### TreeStore (фасад для обратной совместимости)

```typescript
const store = new TreeStore(items)

store.getAll()           // Все элементы
store.getItem(id)        // Элемент по id
store.getChildren(id)    // Прямые потомки
store.getAllChildren(id) // Все потомки
store.getAllParents(id)  // Все предки
store.addItem(item)      // Добавить элемент
store.updateItem(item)   // Обновить элемент
store.removeItem(id)     // Удалить элемент
```

### Vue-компонент

- Использует AgGrid Enterprise для отображения древовидной структуры
- Автоматическая группировка строк по иерархии
- Колонки: № п/п, Категория (Группа/Элемент), Наименование
- Разворачиваемые строки для элементов с дочерними

## Технологии

- Vue 3 (Composition API)
- TypeScript
- AgGrid Enterprise
- Vite
- Vitest

## Лицензия

MIT

