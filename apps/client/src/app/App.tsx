import { Route, Routes } from 'react-router'
import Layout from '../layout/Layout'
import Home from './home'
import Login from './login/Login'
import Register from './login/Register'
import NotFound from '../layout/components/NotFound'
import ProductPage from './products'
import ProductDetails from './products/details'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="products/:productId" element={<ProductDetails />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
