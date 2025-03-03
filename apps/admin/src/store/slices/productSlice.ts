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

// GET Products
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

// POST Product
export const addProduct = createAsyncThunk(
  'product/addProduct',
  async (newProduct: Omit<Product, 'id'>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/products', newProduct)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Lỗi không xác định')
    }
  },
)

// PUT Product
export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async (updatedProduct: Product, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/products/${updatedProduct.id}`,
        updatedProduct,
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Lỗi không xác định')
    }
  },
)

// DELETE Product
export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/products/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Lỗi không xác định')
    }
  },
)

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
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

      // POST
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.products.push(action.payload)
        },
      )

      // PUT
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const index = state.products.findIndex(
            (p) => p.id === action.payload.id,
          )
          if (index !== -1) {
            state.products[index] = action.payload
          }
        },
      )

      // DELETE
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.products = state.products.filter(
            (product) => product.id !== action.payload,
          )
        },
      )
  },
})

export default productSlice.reducer
