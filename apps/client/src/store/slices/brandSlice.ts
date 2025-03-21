import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import apiClient from '@store/services/apiClient'
import { Brand, BrandState } from '#types/brand'
import { ApiErrorResponse } from '#types/api'

const initialCategoriesState: BrandState = {
  data: [],
  selectedItem: null,
  loading: false,
  error: null,
}

export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/brands')
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

export const fetchBrandById = createAsyncThunk<
  Brand,
  number,
  { rejectValue: string }
>('brands/fetchBrandById', async (id, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(`/brands/${id}`)
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

export const addBrand = createAsyncThunk(
  'brands/addBrand',
  async (newBrand: Omit<Brand, 'id'>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/brands', newBrand)
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

export const updateBrand = createAsyncThunk(
  'brands/updateBrand',
  async (updateBrand: Brand, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/brands/${updateBrand.id}`,
        updateBrand,
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

export const deleteBrand = createAsyncThunk(
  'brands/deleteBrand',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/brands/${id}`)
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

const brandSlice = createSlice({
  name: 'brands',
  initialState: initialCategoriesState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.data
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(addBrand.fulfilled, (state, action: PayloadAction<Brand>) => {
        state.data.push(action.payload)
      })
      .addCase(fetchBrandById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchBrandById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedItem = action.payload
      })
      .addCase(fetchBrandById.rejected, (state) => {
        state.loading = false
      })
      .addCase(
        deleteBrand.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.data = state.data.filter(
            (category) => category.id !== action.payload,
          )
        },
      )
  },
})

export default brandSlice.reducer
