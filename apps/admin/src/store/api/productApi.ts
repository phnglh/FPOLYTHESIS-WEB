import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import axios, { AxiosError } from 'axios'
import { GetProductsResponse, Product } from '../../types/product'
import { ApiError, ApiRequest, ApiResponse } from '../../types/api'
import { getErrorMessage } from '../../utils/error'
import { transformResponse } from '#types/api'

export const axiosBaseQuery =
  <T>({
    baseUrl,
  }: {
    baseUrl: string
  }): BaseQueryFn<Partial<ApiRequest<T>>, ApiResponse<T>, ApiError> =>
  async ({ url, method = 'GET', data, params }) => {
    try {
      const { data: result } = await axios<T>({
        url: baseUrl + url,
        method,
        data,
        params,
      })
      return { data: { data: result } }
    } catch (error) {
      const err = error as AxiosError
      return {
        error: {
          status: err.response?.status ?? 500,
          message: err.message,
          data: err.response?.data,
        },
      }
    }
  }

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/v1' }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query<GetProductsResponse, void>({
      query: () => '/products',
      transformResponse,
      transformErrorResponse: (response) => {
        return {
          message: getErrorMessage(response as FetchBaseQueryError),
          status: (response as FetchBaseQueryError).status,
        }
      },
      providesTags: ['Products'],
    }),
    getProduct: builder.query<GetProductsResponse, number>({
      query: (id) => `/products/${id}`,
      transformResponse,
      transformErrorResponse: (response) => {
        return {
          message: getErrorMessage(response as FetchBaseQueryError),
          status: (response as FetchBaseQueryError).status,
        }
      },
      providesTags: (__, _, id) => [{ type: 'Products', id }],
    }),

    addProduct: builder.mutation<void, Product>({
      query: (newProduct) => ({
        url: '/products',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: ['Products'],
    }),

    updateProduct: builder.mutation<void, Product>({
      query: (product) => ({
        url: `/products/${product.id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: ['Products'],
    }),

    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi

export const {
  getProducts,
  getProduct,
  updateProduct,
  addProduct,
  deleteProduct,
} = productApi.endpoints
