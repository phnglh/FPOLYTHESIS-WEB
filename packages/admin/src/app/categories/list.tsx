import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useList, useTranslate } from '@refinedev/core'
import { useDataGrid } from '@refinedev/mui'
import { useMemo } from 'react'

export const CategoryList = () => {
  const { dataGridProps } = useDataGrid()

  const translate = useTranslate()

  const { data: categoryData, isLoading: categoryLoading } = useList({
    resource: 'categories',
    pagination: {
      mode: 'off',
    },
  })

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'id',
        flex: 1,
        headerName: translate('categories.fields.id'),
        minWidth: 100,
      },
      {
        field: 'title',
        flex: 1,
        headerName: translate('categories.fields.title'),
        minWidth: 300,
      },
    ],
    [translate],
  )

  return (
    <DataGrid
      {...dataGridProps}
      columns={columns}
      rows={categoryData?.data ?? []}
      loading={categoryLoading}
    />
  )
}
