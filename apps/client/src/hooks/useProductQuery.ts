import { useGetProductsQuery } from '../store/api/productApi'
import { getErrorMessage } from '../utils/error'

export const useProductList = () => {
  const { data, error, isLoading } = useGetProductsQuery(undefined, {
    pollingInterval: 10000,
  })

  const errorMessage = error ? getErrorMessage(error) : null

  return { data, isLoading, errorMessage }
}
