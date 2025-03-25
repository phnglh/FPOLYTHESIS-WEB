import { ApiErrorResponse } from '#types/api'
import { Cart, CartItem, CartState } from '#types/cart'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import apiClient from '@store/services/apiClient'
import { RootState } from '@store/store'

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
        items: cartData.items.map((item: CartItem) => ({
          id: item.id,
          cart_id: item.cart_id,
          sku_id: item.sku_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          sku: {
            id: item.sku.id,
            sku: item.sku.sku,
            product_id: item.sku.product_id,
            image_url: item.sku.image_url,
            price: item.sku.price,
            stock: item.sku.stock,
          },
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
    { sku_id, quantity }: { sku_id: number; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      const res = await apiClient.post('/cart', { sku_id, quantity })
      return res.data.data
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
      const res = await apiClient.delete(`/cart/${id}`)
      return res.data
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
        state.loading = true
        state.error = null
      })
      .addCase(
        removeFromCart.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          if (state.data) {
            state.data = {
              ...state.data,
              items: state.data.items.filter(
                (item) => item.id !== action.payload.id,
              ),
            }
          }
        },
      )

      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const selectCartItems = (state: RootState) => state.cart.data?.items

export default cartSlice.reducer
