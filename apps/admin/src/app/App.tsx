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
import PrivateRoute from '@routes/PrivateRoute.tsx'
import OrderManagement from '@app/orders'
import OrderDetails from '@app/orders/detail'
import OrderInvoice from '@app/orders/invoice'
import ProductVariants from '@app/products/product-variants'
import AddProductVariants from '@app/products/product-variants/add-product-variants'

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
          <Route
            path="product-variants/:id"
            element={<ProductVariants />}
          ></Route>
          <Route path="update/:id" element={<UpdateProduct />} />
          <Route
            path="add-product-variants/:id"
            element={<AddProductVariants />}
          />
        </Route>
        <Route path="attributes">
          <Route index element={<AttributeManagement />} />
        </Route>
        <Route path="orders">
          <Route index element={<OrderManagement />} />
          <Route path=":id" element={<OrderDetails />} />
          <Route path=":id/invoice" element={<OrderInvoice />} />
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
