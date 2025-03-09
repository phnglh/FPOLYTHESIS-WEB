import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import apiClient from '@store/services/apiClient'
import { Category, CategoryState } from '#types/category'

const initialCategoriesState: CategoryState = {
  data: [],
  loading: false,
  error: null,
}
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/categories')
      console.log(response)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Lỗi không xác định')
    }
  },
)

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (newCategory: Omit<Category, 'id'>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/categories', newCategory)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Lỗi không xác định')
    }
  },
)
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/categories/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Lỗi không xác định')
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
      .addCase(
        deleteCategory.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.data = state.data.filter(
            (category) => category.id !== action.payload,
          )
        },
      )
  },
})

export default categorySlice.reducer
