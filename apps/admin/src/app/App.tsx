import { Route, Routes } from 'react-router'
import AdminLayout from '../layout/Layout'
import ProductPage from './products'
import NotFound from '../layout/components/NotFound'
import CategoryManagement from '@app/categories'
import LoginPage from '@app/login'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@store/store'
import { useEffect } from 'react'
import { initializeAuth } from '@store/slices/authSlice'
import PrivateRoute from '@app/routes/PrivateRoute'
import Dashboard from './dashboard'

function App() {
  const dispatch = useDispatch()
  const isInitialized = useSelector(
    (state: RootState) => state.auth.isInitialized,
  )
  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  if (!isInitialized) return null
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard" element={<h1>dashboard</h1>} />
        <Route path="quan-ly-danh-muc" element={<CategoryManagement />} />
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
