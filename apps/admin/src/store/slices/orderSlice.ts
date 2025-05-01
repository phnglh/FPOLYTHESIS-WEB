import { ApiErrorResponse } from '#types/api'
import { Order, OrderItem, OrderState } from '#types/order'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import apiClient from '@store/services/apiClient'

const initialOrderState: OrderState = {
  data: [],
  selectedItem: null,
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
      const errMsg =
        (error as ApiErrorResponse)?.message || 'Lỗi không xác định'
      return rejectWithValue(errMsg)
    }
  },
)

// Lấy danh sách đơn hàng
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/orders?page=${page}`)
      return res.data
    } catch (error: unknown) {
      const errMsg =
        (error as ApiErrorResponse)?.message || 'Lỗi không xác định'
      return rejectWithValue(errMsg)
    }
  },
)

export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId: number, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/orders/${orderId}`)
      return res.data.data
    } catch (error: unknown) {
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
      await apiClient.post(`/orders/${orderId}/cancel`)
      return orderId
    } catch (error: unknown) {
      const errMsg =
        (error as ApiErrorResponse)?.message || 'Lỗi không xác định'
      return rejectWithValue(errMsg)
    }
  },
)

const orderSlice = createSlice({
  name: 'order',
  initialState: initialOrderState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        if (state.data) {
          state.data.push(action.payload)
        } else {
          state.data = [action.payload]
        }
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
          state.data = action.payload
          state.loading = false
        },
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedItem = action.payload
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string // Lưu thông báo lỗi vào state
      })
      .addCase(
        cancelOrder.fulfilled,
        (state, action: PayloadAction<number>) => {
          if (state.data) {
            state.data = state.data.filter(
              (order) => order.id !== action.payload,
            )
          }
        },
      )
  },
})

export default orderSlice.reducer
