import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import axios, { AxiosError } from 'axios'
import { GetProductsResponse } from '../../types/products'
import { ApiError, ApiRequest, ApiResponse } from '../../types/api'

export const axiosBaseQuery =
  <T>({
    baseUrl,
  }: {
    baseUrl: string
  }): BaseQueryFn<ApiRequest<T>, ApiResponse<T>, ApiError> =>
  async ({ url, method = 'GET', data, params }) => {
    try {
      const result = await axios<T>({
        url: baseUrl + url,
        method,
        data,
        params,
      })

      return { data: { data: result.data } }
    } catch (error) {
      const axiosError = error as AxiosError

      return {
        error: {
          status: axiosError.response?.status ?? 500,
          message: axiosError.message,
          data: axiosError.response?.data,
        },
      }
    }
  }

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api' }),
  endpoints: (builder) => ({
    getProducts: builder.query<GetProductsResponse, void>({
      query: () => '/products',
      transformResponse: (response: ApiResponse<GetProductsResponse>) =>
        response.data,
    }),
  }),
})

export const useGetProductsQuery = productApi.endpoints.getProducts.useQuery
export const { getProducts } = productApi.endpoints
