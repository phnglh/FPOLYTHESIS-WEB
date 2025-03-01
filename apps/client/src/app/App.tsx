import { Route, Routes } from 'react-router'
import Layout from '../layout/Layout'
import Home from './home'
import Login from './login/Login'
import Register from './login/Register'
import AboutUsPage from './about'
import ContactPage from './contact'
import NewsPage from './news'
import StoresPage from './stores'
import CartPage from './carts'
import ProductPage from './products'
import NotFound from '../layout/components/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="carts" element={<CartPage />} />
        <Route path="gioi-thieu" element={<AboutUsPage />} />
        <Route path="lien-he" element={<ContactPage />} />
        <Route path="tin-tuc" element={<NewsPage />} />
        <Route path="he-thong-cua-hang" element={<StoresPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
