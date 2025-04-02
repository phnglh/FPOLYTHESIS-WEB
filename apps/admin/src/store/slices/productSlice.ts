import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import apiClient from '../services/apiClient'
import { Product, ProductsState } from '#types/product'

const initialProductsState: ProductsState = {
  data: [],
  selectedItem: null,
  loading: false,
  error: null,
}

// GET Products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
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
  'products/addProduct',
  async (newProduct: Omit<Product, 'id'>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/products', newProduct, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Lỗi không xác định')
    }
  },
)

// PUT Product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
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
  'products/deleteProduct',
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
  name: 'products',
  initialState: initialProductsState,
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
          state.data = action.payload
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
          state.data.push(action.payload)
        },
      )

      // PUT
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const index = state.data.findIndex((p) => p.id === action.payload.id)
          if (index !== -1) {
            state.data[index] = action.payload
          }
        },
      )

      // DELETE
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.data = state.data.filter(
            (product) => product.id !== action.payload,
          )
        },
      )
  },
})

export default productSlice.reducer
