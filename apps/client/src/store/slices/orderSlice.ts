import { ApiErrorResponse } from '#types/api'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import apiClient from '@store/services/apiClient'

export interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: number
  items: OrderItem[]
  totalPrice: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
}

interface OrderState {
  orders: Order[]
  loading: boolean
  error: string | null
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
}

// Tạo đơn hàng mới
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (items: OrderItem[], { rejectWithValue }) => {
    try {
      const res = await apiClient.post('/orders', { items })
      return res.data
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

// Lấy danh sách đơn hàng
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/orders')
      return res.data
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

// Hủy đơn hàng
export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (orderId: number, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/orders/${orderId}`)
      return orderId
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

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.orders.push(action.payload)
        state.loading = false
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.orders = action.payload
          state.loading = false
        },
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
      .addCase(
        cancelOrder.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.orders = state.orders.filter(
            (order) => order.id !== action.payload,
          )
        },
      )
  },
})

export default orderSlice.reducer
