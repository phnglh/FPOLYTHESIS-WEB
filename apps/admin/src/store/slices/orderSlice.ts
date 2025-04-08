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

// Lấy danh sách đơn hàng (của user hiện tại)
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/orders')
      console.log('Kết quả API /orders:', res)
      if (res.data && res.data.data && res.data.data.data) {
        console.log('Kết quả API /orders:', res.data.data.data)
        return res.data.data.data
      } else {
        throw new Error('Dữ liệu không hợp lệ từ API')
      }
    } catch (error: unknown) {
      const errMsg =
        (error as ApiErrorResponse)?.message || 'Lỗi không xác định'
      return rejectWithValue(errMsg)
    }
  },
)

// Lấy toàn bộ đơn hàng (cho admin)
export const fetchAllOrders = createAsyncThunk(
  'order/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/orders/all')
      return res.data.data
    } catch (error: unknown) {
      const errMsg =
        (error as ApiErrorResponse)?.message || 'Lỗi không xác định'
      return rejectWithValue(errMsg)
    }
  },
)

// Lấy đơn hàng theo ID
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
      // Tạo đơn hàng
      .addCase(createOrder.pending, (state) => {
        state.loading = true
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.data.push(action.payload)
        state.loading = false
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })

      // Lấy danh sách đơn hàng (user)
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

      // Lấy tất cả đơn hàng (admin)
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true
      })
      .addCase(
        fetchAllOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.data = action.payload
          state.loading = false
        },
      )
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })

      // Lấy đơn hàng theo ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.selectedItem = action.payload
          state.loading = false
        },
      )
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })

      // Hủy đơn hàng
      .addCase(
        cancelOrder.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.data = state.data.filter((order) => order.id !== action.payload)
        },
      )
  },
})

export default orderSlice.reducer
