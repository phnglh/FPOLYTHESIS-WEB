import { Route, Routes } from 'react-router'
import AppLayout from '../layout/Layout'
import Home from './home'
import Login from './login'
import Register from './register'
import AboutUsPage from './about'
import ContactPage from './contact'
import NewsPage from './news'
import StoresPage from './stores'
import CartPage from './cart'
import ProductPage from './products'
import FavoriteProducts from './wishlist'
import CheckoutPage from './checkout'
import ProductDetailPage from './products/details'
import NotFound from '../layout/components/NotFound'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { initializeAuth } from '@store/slices/authSlice'
import { AppDispatch, RootState } from '@store/store'
import ProtectedRoute from '../routes/PublicRoute'
import ProfilePage from '@app/profile'
// import OrdersPage from '@app/orders'
import OrderDetailPage from '@app/orders/detail'
import OrderSuccess from '@app/orders/detail/order-success.tsx'
import { AccountLayout } from '@layout/AccountLayout'
import PrivateRoute from '@routes/PrivateRoute'
import PublicRoute from '../routes/PublicRoute'
import AddressPage from '@app/profile/address'

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
          <Route path=":id" element={<ProductDetailPage />} />
        </Route>
        <Route path="carts" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-status" element={<OrderSuccess />} />

        <Route
          path="account"
          element={
            <PrivateRoute>
              <AccountLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<ProfilePage />} />
          {/* <Route path="orders" element={<OrdersPage />} /> */}
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="address" element={<AddressPage />} />
        </Route>

        <Route path="about" element={<AboutUsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="stores" element={<StoresPage />} />
        <Route path="wishlist" element={<FavoriteProducts />} />
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="register"
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
