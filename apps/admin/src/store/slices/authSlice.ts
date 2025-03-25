import { ApiErrorResponse } from '#types/api'
import { AuthState } from '#types/auth'
import { User } from '#types/user'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import apiClient from '@store/services/apiClient'

const initialState: AuthState = {
  user: null,
  token: null,
  isInitialized: false,
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (values: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post('/login', values)
      const { user, token } = res.data.data

      if (user.role !== 'admin') {
        return rejectWithValue('Tài khoản không có quyền truy cập!')
      }

      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('access_token', token)

      return { user, token: token }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      const errMsg =
        (error as ApiErrorResponse)?.message || 'Đăng nhập không thành công!'
      return rejectWithValue(errMsg)
    }
  },
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/logout')
      return response.data
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      const errMsg =
        (error as ApiErrorResponse)?.message || 'Đăng xuất thất bại!'
      return rejectWithValue(errMsg)
    }
  },
)

export const register = createAsyncThunk(
  'auth/register',
  async (values: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post('/register', values)
      const { user, token } = res.data.data

      localStorage.setItem('access_token', token)
      return { user, token }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      const errMsg =
        (error as ApiErrorResponse)?.message || 'Đăng ký không thành công!'
      return rejectWithValue(errMsg)
    }
  },
)
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth(state) {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('access_token')

      state.user = storedUser ? JSON.parse(storedUser) : null
      state.token = storedToken || ''
      state.isInitialized = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.user = action.payload.user
          state.token = action.payload.token
          state.isInitialized = true
          state.loading = false
        },
      )
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isInitialized = true
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
      })
  },
})

export const { initializeAuth } = authSlice.actions
export default authSlice.reducer
