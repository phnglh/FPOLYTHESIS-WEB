import { Route, Routes } from 'react-router'
import AppLayout from '../layout/Layout'
import Home from './home'
import Login from './login/Login'
import Register from './login/Register'
import AboutUsPage from './about'
import ContactPage from './contact'
import NewsPage from './news'
import StoresPage from './stores'
import CartPage from './carts'
import ProductPage from './products'
import FavoriteProducts from './products/wishlist'
import CheckoutPage from './products/checkout'
import ProductDetailPage from './products/details'
import NotFound from '../layout/components/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="products">
          <Route index element={<ProductPage />} />
          <Route path=":slug" element={<ProductPage />} />
          <Route path=":id" element={<ProductDetailPage />} />
        </Route>
        <Route path="carts" element={<CartPage />} />
        <Route path="about" element={<AboutUsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="stores" element={<StoresPage />} />

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
