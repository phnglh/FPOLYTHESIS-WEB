import { ApiErrorResponse } from '#types/api'
import { Cart, CartItem, CartState } from '#types/cart'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import apiClient from '@store/services/apiClient'
import { RootState } from '@store/store'

// Khởi tạo state ban đầu
const initialState: CartState = {
  data: null,
  selectedItem: null,
  loading: false,
  error: null,
}

const saveCartToSessionStorage = (items: CartItem[]) => {
  sessionStorage.setItem('cart', JSON.stringify(items))
}

const getCartFromSessionStorage = (): CartItem[] => {
  const cart = sessionStorage.getItem('cart')
  return cart ? JSON.parse(cart) : []
}

// Thunk để lấy giỏ hàng từ API
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/cart')
      const cartData = res.data?.data

      if (!cartData || !cartData.items) {
        const cartFromSession = getCartFromSessionStorage()
        return {
          id: cartData?.id || null,
          user_id: cartData?.user_id || null,
          items: cartFromSession.length > 0 ? cartFromSession : [],
        }
      }

      const formattedCart = {
        id: cartData.id,
        user_id: cartData.user_id,
        items: cartData.items.map((item: CartItem) => ({
          id: item.id,
          cart_id: item.cart_id,
          sku_id: item.sku_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          sku: {
            id: item.sku?.id,
            sku: item.sku?.sku,
            product_id: item.sku?.product_id,
            image_url: item.sku?.image_url,
            price: item.sku?.price,
            stock: item.sku?.stock,
            attributes:
              item.sku?.attributes?.map((attr) => ({
                id: attr.id || null,
                name: attr.name || 'N/A',
                value: attr.value || 'N/A',
              })) || [],
          },
        })),
      }

      // Lưu giỏ hàng vào sessionStorage sau khi fetch thành công
      saveCartToSessionStorage(formattedCart.items)
      return formattedCart
    } catch (error: unknown) {
      return rejectWithValue(
        (error as ApiErrorResponse)?.message || 'Lỗi khi tải giỏ hàng',
      )
    }
  },
)

// Thunk để thêm sản phẩm vào giỏ hàng
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    { sku_id, quantity }: { sku_id: number; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      const res = await apiClient.post('/cart', { sku_id, quantity })
      const newCart = res.data.data
      // Lưu giỏ hàng vào sessionStorage
      saveCartToSessionStorage(newCart.items)
      return newCart
    } catch (error: unknown) {
      return rejectWithValue(
        (error as ApiErrorResponse)?.message || 'Lỗi không xác định',
      )
    }
  },
)

// Thunk để xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/cart/${id}`)
      return id // Trả về id để cập nhật state cục bộ
    } catch (error: unknown) {
      return rejectWithValue(
        (error as ApiErrorResponse)?.message || 'Lỗi khi xóa sản phẩm',
      )
    }
  },
)

// Thunk để cập nhật số lượng sản phẩm
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, quantity }: { id: number; quantity: number }) => {
    await apiClient.put(`/cart/${id}`, { quantity })
    return { id, quantity }
  },
)

// Thunk để tăng số lượng sản phẩm
export const incrementCartItem = createAsyncThunk(
  'cart/incrementCartItem',
  async (id: number) => {
    await apiClient.patch(`/cart/increment/${id}`)
    return id
  },
)

// Thunk để giảm số lượng sản phẩm
export const decrementCartItem = createAsyncThunk(
  'cart/decrementCartItem',
  async (id: number) => {
    await apiClient.patch(`/cart/decrement/${id}`)
    return id
  },
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Thêm reducer để khôi phục giỏ hàng từ sessionStorage
    restoreCartFromSession: (state) => {
      const cartItems = getCartFromSessionStorage()
      if (cartItems.length > 0 && (!state.data || !state.data.items)) {
        state.data = {
          id: null,
          user_id: null,
          items: cartItems,
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.data = action.payload
        state.loading = false
        // Lưu lại vào sessionStorage
        if (action.payload.items) {
          saveCartToSessionStorage(action.payload.items)
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
        // Nếu API thất bại, thử khôi phục từ sessionStorage
        const cartItems = getCartFromSessionStorage()
        if (cartItems.length > 0) {
          state.data = {
            id: null,
            user_id: null,
            items: cartItems,
          }
        }
      })
      .addCase(addToCart.pending, (state) => {
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.data = action.payload
        // Lưu vào sessionStorage
        if (action.payload.items) {
          saveCartToSessionStorage(action.payload.items)
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false
        if (state.data) {
          state.data.items = state.data.items.filter(
            (item) => item.id !== action.payload,
          )
          // Lưu lại vào sessionStorage sau khi xóa
          saveCartToSessionStorage(state.data.items)
        }
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (state.data) {
          const item = state.data.items.find((i) => i.id === action.payload.id)
          if (item) item.quantity = action.payload.quantity
          // Lưu lại vào sessionStorage
          saveCartToSessionStorage(state.data.items)
        }
      })
      .addCase(incrementCartItem.fulfilled, (state, action) => {
        if (state.data) {
          const item = state.data.items.find((i) => i.id === action.payload)
          if (item) item.quantity += 1
          // Lưu lại vào sessionStorage
          saveCartToSessionStorage(state.data.items)
        }
      })
      .addCase(decrementCartItem.fulfilled, (state, action) => {
        if (state.data) {
          const item = state.data.items.find((i) => i.id === action.payload)
          if (item && item.quantity > 1) item.quantity -= 1
          // Lưu lại vào sessionStorage
          saveCartToSessionStorage(state.data.items)
        }
      })
  },
})

export const { restoreCartFromSession } = cartSlice.actions
export const selectCartItems = (state: RootState) => state.cart.data?.items

export default cartSlice.reducer
