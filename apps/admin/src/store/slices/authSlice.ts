import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: number
  name: string
  email: string
  role: string
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isInitialized: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isInitialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth(state) {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('access_token')

      state.user = storedUser ? JSON.parse(storedUser) : null
      state.token = storedToken || null
      state.isInitialized = true
    },
    setAuth: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isInitialized = true
    },
    login(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token

      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('access_token', action.payload.token)
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isInitialized = true

      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
    },
  },
})

export const { initializeAuth, setAuth, login, logout } = authSlice.actions
export default authSlice.reducer
