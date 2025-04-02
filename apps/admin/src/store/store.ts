import { configureStore } from '@reduxjs/toolkit'
import productReducer from '@store/slices/productSlice'
import { productApi } from '@store/api/productApi'
import categoryReducer from '@store/slices/categorySlice'
import authReducer from '@store/slices/authSlice'
import brandReducer from '@store/slices/brandSlice'
import attributeSlice from '@store/slices/attributeSlice'
import userSlice from '@store/slices/userSlice'
import orderSlice from '@store/slices/orderSlice.ts'

export const store = configureStore({
  reducer: {
    products: productReducer,
    productApi: productApi.reducer,
    categories: categoryReducer,
    auth: authReducer,
    brands: brandReducer,
    attributes: attributeSlice,
    users: userSlice,
    orders: orderSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
