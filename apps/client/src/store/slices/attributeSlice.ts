import { ApiErrorResponse } from '#types/api'
import { Attribute, AttributeState } from '#types/products'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import apiClient from '@store/services/apiClient'

const initialAttributeState: AttributeState = {
  data: [],
  selectedItem: null,
  loading: false,
  error: null,
}

export const fetchAttributes = createAsyncThunk(
  'attributes/fetchAttributes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('attributes')
      return response.data
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

export const fetchAttributeById = createAsyncThunk<
  Attribute,
  number,
  { rejectValue: string }
>('attributes/fetchAttributeById', async (id, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(`attributes/${id}`)
    return response.data
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    const errMsg = (error as ApiErrorResponse).message
    return rejectWithValue(errMsg)
  }
})

const attributeSlice = createSlice({
  name: 'attributes',
  initialState: initialAttributeState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAttributes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAttributes.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.data
      })
      .addCase(fetchAttributes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchAttributeById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAttributeById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedItem = action.payload
      })
      .addCase(fetchAttributeById.rejected, (state) => {
        state.loading = false
      })
  },
})

export default attributeSlice.reducer
