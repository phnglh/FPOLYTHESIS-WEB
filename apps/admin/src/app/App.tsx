import { Navigate, Route, Routes } from 'react-router'
import AdminLayout from '../layout/Layout'
import ProductPage from './products'
import NotFound from '../layout/components/NotFound'
// import Dashboard from './dasboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        {/* <Route path="dashboard" element={<Dashboard />} /> */}
        <Route path="dashboard" element={<h1>dashboard</h1>} />
        <Route path="quan-ly-san-pham" element={<ProductPage />} />
        <Route path="products">
          <Route index element={<ProductPage />} />
          <Route path="add" element={<h1>Product detail</h1>} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
