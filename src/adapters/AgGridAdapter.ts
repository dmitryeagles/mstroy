import type { GridRow } from '../types'
import type { ColDef } from 'ag-grid-community'

export class AgGridAdapter {
  static getRowId(params: { data: GridRow }): string {
    return String(params.data.id)
  }

  static getDataPath(data: GridRow): string[] {
    return data.path
  }

  static getColumnDefs(): ColDef[] {
    return [
      {
        headerName: '№ п/п',
        width: 100,
        cellRenderer: (params: any) => params.node.rowIndex + 1,
        sortable: false,
        filter: false,
        pinned: 'left',
        suppressMovable: true,
        lockPosition: true
      },
      {
        headerName: 'Наименование',
        field: 'label',
        flex: 1,
        sortable: false,
        filter: false,
        suppressMovable: true
      }
    ]
  }

  static getDefaultColDef(): ColDef {
    return {
      resizable: false,
      sortable: false,
      filter: false
    }
  }

  static getAutoGroupColumnDef(): ColDef {
    return {
      headerName: 'Категория',
      field: 'category',
      width: 300,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        suppressCount: true,
        innerRenderer: (params: any) => {
          if (!params.data) return ''
          const text = params.data.category === 'Группа' ? 'Группа' : 'Элемент'
          const span = document.createElement('span')
          span.className = 'ag-group-value-custom'
          span.setAttribute('data-level', String(params.node?.level || 0))
          span.textContent = text
          return span
        }
      },
      sortable: false,
      filter: false,
      suppressMovable: true,
      lockPosition: true
    }
  }

  static getDefaultGridOptions() {
    return {
      treeData: true,
      groupDefaultExpanded: -1,
      rowGroupPanelShow: 'never' as const,
      suppressRowClickSelection: true,
      animateRows: true,
      enableRangeSelection: false,
      enableCharts: false,
      suppressAggFuncInHeader: true,
      rowSelection: 'single' as const
    }
  }
}

