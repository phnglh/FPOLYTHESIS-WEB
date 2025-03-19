import { ApiErrorResponse } from '#types/api'
import { UserState } from '#types/user'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import apiClient from '@store/services/apiClient'

const initialUserState: UserState = {
  data: [],
  selectedItem: null,
  loading: false,
  error: null,
}

export const fetchUsers = createAsyncThunk(
  'products/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/users')
      return response.data
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      const errMsg = (error as ApiErrorResponse)?.message
      return rejectWithValue(errMsg)
    }
  },
)

const userSlice = createSlice({
  name: 'users',
  initialState: initialUserState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default userSlice.reducer
