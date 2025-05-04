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
      {
        page: number
        per_page: number
        category?: number
        brand?: number
        minPrice?: number
        maxPrice?: number
        sort?: 'newest'
      }
    >({
      query: ({
        page,
        per_page,
        category,
        brand,
        minPrice,
        maxPrice,
        sort,
      }) => {
        const params = new URLSearchParams()

        params.append('page', String(page))
        params.append('per_page', String(per_page))

        if (category !== undefined) params.append('category', String(category))
        if (brand !== undefined) params.append('brand', String(brand))
        if (sort) params.append('sort', sort)

        console.log('params', params.toString(), minPrice, maxPrice)
        return `/products?${params.toString()}`
      },
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
