import { ApiErrorResponse } from '#types/api'
import { AuthState } from '#types/auth'
import { User } from '#types/user'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import apiClient from '@store/services/apiClient'

const initialState: AuthState = {
  user: null,
  access_token: null,
  isInitialized: false,
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (values: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post('/login', values)
      const { user, access_token } = res.data.data

      localStorage.setItem('access_token', access_token)

      return { user, access_token }
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

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/users/profile')
      return res.data
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      const errMsg =
        (error as ApiErrorResponse)?.message || 'Lấy thông tin user thất bại!'
      return rejectWithValue(errMsg)
    }
  },
)

export const register = createAsyncThunk(
  'auth/register',
  async (values: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post('/register', values)
      const { user, access_token } = res.data.data

      return { user, access_token }
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
      state.access_token = storedToken || ''
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
        (
          state,
          action: PayloadAction<{ user: User; access_token: string }>,
        ) => {
          state.user = action.payload.user
          state.access_token = action.payload.access_token
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
        state.access_token = null
        state.isInitialized = true
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload
        state.isInitialized = true
        state.loading = false
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        register.fulfilled,
        (
          state,
          action: PayloadAction<{ user: User; access_token: string }>,
        ) => {
          state.user = action.payload.user
          state.access_token = action.payload.access_token
          state.isInitialized = true
          state.loading = false
          localStorage.setItem('access_token', action.payload.access_token)
        },
      )
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
  },
})

export const { initializeAuth } = authSlice.actions
export default authSlice.reducer
