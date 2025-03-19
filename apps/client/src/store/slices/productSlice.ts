import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import apiClient from '../services/apiClient'

// Interface
interface Product {
  id: number
  name: string
  price: number
}

interface ProductState {
  products: Product[]
  loading: boolean
  error: string | null
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
}

// Async Thunk: Fetch Products
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/products')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Lỗi không xác định')
    }
  },
)

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {}, // Không cần reducers khi dùng thunk
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.products = action.payload
          state.loading = false
        },
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
  },
})

export default productSlice.reducer
