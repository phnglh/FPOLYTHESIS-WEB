import { useState } from 'react'
import { useGetProductsQuery } from '../store/api/productApi'
import { getErrorMessage } from '../utils/error'

export const useProductList = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const { data, error, isLoading } = useGetProductsQuery(
    { page: pagination.current, limit: pagination.pageSize },
    { pollingInterval: 10000 },
  )

  const errorMessage = error ? getErrorMessage(error) : null

  const handleTableChange = (paginationConfig: any) => {
    setPagination({
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
    })
  }

  return { data, isLoading, errorMessage, pagination, handleTableChange }
}
