import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import apiClient from '@store/services/apiClient'
import { Category, CategoryState } from '#types/category'
import { ApiErrorResponse } from '#types/api'

const initialCategoriesState: CategoryState = {
  data: [],
  selectedItem: null,
  loading: false,
  error: null,
}

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/categories')
      return response.data
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      const errMsg =
        (error as ApiErrorResponse)?.message || 'Lỗi không xác định'
      return rejectWithValue(errMsg)
    }
  },
)

export const fetchCategoryById = createAsyncThunk<
  Category,
  number,
  { rejectValue: string }
>('categories/fetchCategoryById', async (id, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(`/categories/${id}`)
    return response.data.data
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    const errMsg =
      (error as ApiErrorResponse)?.message ||
      'Lỗi không xác định khi lấy danh mục'
    return rejectWithValue(errMsg)
  }
})

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (newCategory: Omit<Category, 'id'>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/categories', newCategory)
      return response.data
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      const errMsg =
        (error as ApiErrorResponse)?.message || 'Lỗi không xác định'
      return rejectWithValue(errMsg)
    }
  },
)

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (updateCategory: Category, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/categories/${updateCategory.id}`,
        updateCategory,
      )
      return response.data
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      const errMsg =
        (error as ApiErrorResponse)?.message || 'Lỗi không xác định'
      return rejectWithValue(errMsg)
    }
  },
)

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number | string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/categories/${id}`)
      return id
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      const errMsg =
        (error as ApiErrorResponse)?.message || 'Lỗi không xác định'
      return rejectWithValue(errMsg)
    }
  },
)

const categorySlice = createSlice({
  name: 'categories',
  initialState: initialCategoriesState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.data
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(
        addCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.data.push(action.payload)
        },
      )
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedItem = action.payload
      })
      .addCase(fetchCategoryById.rejected, (state) => {
        state.loading = false
      })
      .addCase(
        deleteCategory.fulfilled,
        (state, action: PayloadAction<number | string>) => {
          state.data = state.data.filter(
            (category) => category.id !== action.payload,
          )
        },
      )
  },
})

export default categorySlice.reducer
