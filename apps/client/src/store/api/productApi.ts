import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { getErrorMessage } from '../../utils/error'
import { ApiResponse } from '#types/api'
import { Meta, Product } from '#types/products'

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query<
      { data: Product[]; meta: Meta },
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => `/products?page=${page}&per_page=${limit}`,
      transformResponse: (response: { data: Product[]; meta: Meta }) => ({
        data: response.data,
        meta: response.meta,
      }),
      transformErrorResponse: (response) => ({
        message: getErrorMessage(response as FetchBaseQueryError),
        status: (response as FetchBaseQueryError).status,
      }),
      providesTags: ['Products'],
    }),

    getProduct: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: ApiResponse<Product>) => response.data,
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
