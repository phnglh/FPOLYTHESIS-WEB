import { useState, useEffect } from 'react'
import { useGetProductsQuery } from '../store/api/productApi'
import { getErrorMessage } from '../utils/error'

type FilterOptions = {
  category?: number
  brand?: number
  minPrice?: number
  maxPrice?: number
  sort?: 'newest'
  page?: number
  per_page?: number
}

export const useProductList = (filters: FilterOptions = {}) => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 12 })

  const queryParams = {
    page: pagination.current,
    per_page: pagination.pageSize,
    category: filters.category,
    brand: filters.brand,
    min_price: filters.minPrice,
    max_price: filters.maxPrice,
    sort: filters.sort,
  }

  console.log('Filters sent to API:', queryParams)

  const { data, error, isLoading } = useGetProductsQuery(queryParams, {
    pollingInterval: 10000,
  })

  const errorMessage = error ? getErrorMessage(error) : null

  useEffect(() => {
    if (data?.meta) {
      setPagination((prev) => ({
        ...prev,
        current: data.meta.current_page,
        pageSize: data.meta.per_page,
      }))
    }
  }, [data])

  const handleTableChange = (paginationConfig: any) => {
    setPagination({
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
    })
  }

  return {
    data: data?.data,
    meta: data?.meta,
    pagination: {
      total: data?.meta?.total || 0,
      current: pagination.current,
      pageSize: pagination.pageSize,
    },
    isLoading,
    errorMessage,
    handleTableChange,
  }
}
