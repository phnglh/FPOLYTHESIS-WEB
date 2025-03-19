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
import BrandManagement from '@app/brands'
import CreateBrand from '@app/brands/create'
import AttributeManagement from '@app/attributes'
import UserManagement from '@app/users'
import CreateUser from '@app/users/create'


function App() {
  const dispatch = useDispatch()
  const isInitialized = useSelector(
    (state: RootState) => state.auth.isInitialized,
  )
  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  if (!isInitialized) return <NotFound />
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
        <Route path="brands">
          <Route index element={<BrandManagement />} />
          <Route path="create" element={<CreateBrand />} />
          <Route path="update/:id" element={<h1>update</h1>} />
        </Route>
        <Route path="products">
          <Route index element={<ProductPage />} />
          <Route path="create" element={<CreateProduct />} />
          <Route path="update" element={<UpdateProduct />} />
        </Route>
        <Route path="attributes">
          <Route index element={<AttributeManagement />} />
        </Route>
        <Route path="users">
          <Route index element={<UserManagement />} />
          <Route path="create" element={<CreateUser />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
