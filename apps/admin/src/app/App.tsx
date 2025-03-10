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
import CreateCategory from '@app/categories/create'
import UpdateCategory from '@app/categories/update'
import CreateProduct from '@app/products/add'
import UpdateProduct from '@app/products/update'

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
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="categories">
          <Route index element={<CategoryManagement />} />
          <Route path="create" element={<CreateCategory />} />
          <Route path="update/:id" element={<UpdateCategory />} />
        </Route>
        <Route path="quan-ly-san-pham" element={<ProductPage />} />
        <Route path="products">
          <Route index element={<ProductPage />} />
          <Route path="create" element={<CreateProduct />} />
          <Route path="update" element={<UpdateProduct />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
