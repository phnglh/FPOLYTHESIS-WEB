import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import apiClient from '@store/services/apiClient'
import { Attribute, AttributeState, AttributeValue } from '#types/product'
import { ApiErrorResponse } from '#types/api'

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

export const addAttribute = createAsyncThunk(
  'attributes/addAttribute',
  async (attribute: Omit<Attribute, 'id'>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('attributes', attribute)
      return response.data
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue((error as ApiErrorResponse).message)
    }
  },
)

export const updateAttribute = createAsyncThunk(
  'attributes/updateAttribute',
  async ({ id, ...data }: Attribute, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`attributes/${id}`, data)
      return response.data
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue((error as ApiErrorResponse).message)
    }
  },
)

export const deleteAttribute = createAsyncThunk(
  'attributes/deleteAttribute',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`attributes/${id}`)
      return response.data
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue((error as ApiErrorResponse).message)
    }
  },
)

export const fetchAttributeValues = createAsyncThunk(
  'attributes/fetchAttributeValues',
  async (attributeId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`attributes/${attributeId}/values`)
      return response.data
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue((error as ApiErrorResponse).message)
    }
  },
)

export const addAttributeValue = createAsyncThunk(
  'attributes/addAttributeValue',
  async (
    { attributeId, value }: { attributeId: number; value: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiClient.post(
        `attributes/${attributeId}/values`,
        { value },
      )
      return response.data
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue((error as ApiErrorResponse).message)
    }
  },
)

export const updateAttributeValue = createAsyncThunk(
  'attributes/updateAttributeValue',
  async ({ id, value }: { id: number; value: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`attributes/values/${id}`, { value })
      return response.data
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue((error as ApiErrorResponse).message)
    }
  },
)

export const deleteAttributeValue = createAsyncThunk(
  'attributes/deleteAttributeValue',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiClient.delete(`attributes/values/${id}`)
      return id
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue((error as ApiErrorResponse).message)
    }
  },
)

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
      .addCase(addAttribute.fulfilled, (state, action) => {
        state.data.push(action.payload)
      })
      .addCase(updateAttribute.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (attr) => attr.id === action.payload.id,
        )
        if (index !== -1) {
          state.data[index] = action.payload
        }
      })
      .addCase(
        deleteAttribute.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.data = state.data.filter(
            (attribute) => attribute.id !== action.payload,
          )
        },
      )
      .addCase(fetchAttributeValues.fulfilled, (state, action) => {
        const attribute = state.data.find((attr) => attr.id === action.meta.arg)
        console.log('🔄 Attribute trước khi cập nhật:', attribute)
        if (attribute) {
          attribute.values = action.payload.data
        }
        console.log('✅ Attribute sau khi cập nhật:', attribute)
      })
      .addCase(addAttributeValue.fulfilled, (state, action) => {
        const attribute = state.data.find(
          (attr) => attr.id === action.meta.arg.attributeId,
        )

        if (attribute) {
          if (!Array.isArray(attribute.values)) {
            attribute.values = []
          }
          attribute.values.push(action.payload)
        }
      })
      .addCase(updateAttributeValue.fulfilled, (state, action) => {
        state.data.forEach((attr) => {
          const valueIndex = attr?.values?.findIndex(
            (val: AttributeValue) => val.id === action.payload.id,
          )
          if (valueIndex !== -1) {
            if (attr.values) {
              if (
                valueIndex !== undefined &&
                valueIndex !== -1 &&
                attr.values
              ) {
                attr.values[valueIndex] = action.payload
              }
            }
          }
        })
      })
      .addCase(deleteAttributeValue.fulfilled, (state, action) => {
        state.data.forEach((attr) => {
          attr.values = attr?.values?.filter(
            (val: AttributeValue) => val.id !== action.payload,
          )
        })
      })
  },
})

export default attributeSlice.reducer
