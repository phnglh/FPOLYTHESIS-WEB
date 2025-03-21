import { configureStore } from '@reduxjs/toolkit'
import productReducer from '@store/slices/productSlice'
import { productApi } from '@store/api/productApi'
import categoryReducer from '@store/slices/categorySlice'
import authReducer from '@store/slices/authSlice'
import brandReducer from '@store/slices/brandSlice'
import attributeSlice from '@store/slices/attributeSlice'
import userSlice from '@store/slices/userSlice'
import cartReducer from '@store/slices/cartSlice'
import orderReducer from '@store/slices/orderSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'auth',
  storage: storage,
  whitelist: ['access_token'],
}

const persistedAuthReducer = persistReducer(persistConfig, authReducer)

export const store = configureStore({
  reducer: {
    products: productReducer,
    productApi: productApi.reducer,
    categories: categoryReducer,
    // auth: authReducer,
    auth: persistedAuthReducer,
    brands: brandReducer,
    attributes: attributeSlice,
    users: userSlice,
    cart: cartReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
