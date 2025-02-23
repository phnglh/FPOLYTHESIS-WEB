import { Route, Routes } from 'react-router'
import Layout from '../layout/Layout'
import Home from './home'
import NotFound from '../layout/components/NotFound'
import ProductPage from './products'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
