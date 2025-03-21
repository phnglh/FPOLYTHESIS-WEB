import { ApiErrorResponse } from '#types/api'
import { Cart, CartItem, CartState } from '#types/cart'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import apiClient from '@store/services/apiClient'

const initialState: CartState = {
  data: null,
  selectedItem: null,
  loading: false,
  error: null,
}

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/cart')
      const cartData = res.data.data

      if (!cartData) {
        return rejectWithValue('Giỏ hàng trống hoặc không tồn tại')
      }

      return {
        id: cartData.id,
        user_id: cartData.user_id,
        created_at: cartData.created_at,
        items: cartData.items.map((item: CartItem) => ({
          id: item.id,
          product_id: item.product_id,
          unit_price: item.unit_price,
          quantity: item.quantity,
          product: item.product,
        })),
      }
    } catch (error: unknown) {
      return rejectWithValue(
        (error as ApiErrorResponse)?.message || 'Lỗi không xác định',
      )
    }
  },
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    { product_id, quantity }: { product_id: number; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      const res = await apiClient.post('/cart', { product_id, quantity })
      return res.data.data // Fix: Đảm bảo lấy đúng `data` từ API
    } catch (error: unknown) {
      return rejectWithValue(
        (error as ApiErrorResponse)?.message || 'Lỗi không xác định',
      )
    }
  },
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await apiClient.delete(`/cart/items/${id}`)
      return res.data.data // Fix: Lấy toàn bộ giỏ hàng sau khi xóa sản phẩm
    } catch (error: unknown) {
      return rejectWithValue(
        (error as ApiErrorResponse)?.message || 'Lỗi không xác định',
      )
    }
  },
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.data = action.payload
        state.loading = false
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
      .addCase(addToCart.pending, (state) => {
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.data = action.payload // Fix: Cập nhật toàn bộ giỏ hàng
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(removeFromCart.pending, (state) => {
        state.error = null
      })
      .addCase(
        removeFromCart.fulfilled,
        (state, action: PayloadAction<Cart>) => {
          state.data = action.payload // Fix: Cập nhật toàn bộ giỏ hàng sau khi xóa sản phẩm
        },
      )
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export default cartSlice.reducer
