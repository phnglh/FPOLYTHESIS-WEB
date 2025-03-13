import { configureStore } from '@reduxjs/toolkit'
import productReducer from '@store/slices/productSlice'
import { productApi } from '@store/api/productApi'
import categoryReducer from '@store/slices/categorySlice'
import authReducer from '@store/slices/authSlice'

export const store = configureStore({
  reducer: {
    products: productReducer,
    [productApi.reducerPath]: productApi.reducer,
    categories: categoryReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
