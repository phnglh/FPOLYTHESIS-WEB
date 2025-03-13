import { transformResponse } from '#types/api'
import { Category, GetCategoryResponse } from '#types/category'
import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { getErrorMessage } from '@utils/error'

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/v1' }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['Categories'],
  endpoints: (builder) => ({
    getCategories: builder.query<GetCategoryResponse, void>({
      query: () => '/products',
      transformResponse,
      transformErrorResponse: (response) => {
        return {
          message: getErrorMessage(response as FetchBaseQueryError),
          status: (response as FetchBaseQueryError).status,
        }
      },
      providesTags: ['Categories'],
    }),
    getCategory: builder.query<GetCategoryResponse, number>({
      query: (id) => `/categories/${id}`,
      transformResponse,
      transformErrorResponse: (response) => {
        return {
          message: getErrorMessage(response as FetchBaseQueryError),
          status: (response as FetchBaseQueryError).status,
        }
      },
      providesTags: (__, _, id) => [{ type: 'Categories', id }],
    }),

    addCategory: builder.mutation<void, Category>({
      query: (newCategory) => ({
        url: '/categories',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: ['Categories'],
    }),

    updateCategory: builder.mutation<void, Category>({
      query: (category) => ({
        url: `/categories/${category.id}`,
        method: 'PUT',
        body: category,
      }),
      invalidatesTags: ['Categories'],
    }),

    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
})

export const {
  useAddCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = categoryApi

export const {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} = categoryApi.endpoints
