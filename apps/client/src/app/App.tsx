import { Route, Routes } from 'react-router'
import AppLayout from '../layout/Layout'
import Home from './home'
import Login from './login'
import Register from './register'
import AboutUsPage from './about'
import ContactPage from './contact'
import NewsPage from './news'
import StoresPage from './stores'
import CartPage from './carts'
import ProductPage from './products'
import FavoriteProducts from './wishlist'
import CheckoutPage from './checkout'
import ProductDetailPage from './products/details'
import NotFound from '../layout/components/NotFound'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { initializeAuth } from '@store/slices/authSlice'
import { AppDispatch, RootState } from '@store/store'

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const isInitialized = useSelector(
    (state: RootState) => state.auth.isInitialized,
  )
  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  if (!isInitialized) return <NotFound />
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />

        <Route path="products">
          <Route index element={<ProductPage />} />
          <Route path=":slug" element={<ProductDetailPage />} />
          <Route path=":id" element={<ProductDetailPage />} />
        </Route>
        <Route path="carts" element={<CartPage />} />
        <Route path="gioi-thieu" element={<AboutUsPage />} />
        <Route path="lien-he" element={<ContactPage />} />
        <Route path="tin-tuc" element={<NewsPage />} />
        <Route path="he-thong-cua-hang" element={<StoresPage />} />
        <Route path="chi-tiet" element={<ProductDetailPage />} />
        <Route path="yeu-thich" element={<FavoriteProducts />} />
        <Route path="thanh-toan" element={<CheckoutPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
