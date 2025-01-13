import { Authenticated, type I18nProvider, Refine } from '@refinedev/core'
import dataProvider from '@refinedev/simple-rest'

import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
} from '@refinedev/react-router'
import { Outlet, Route, Routes } from 'react-router-dom'

import {
  AuthPage,
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  useNotificationProvider,
} from '@refinedev/mui'

import { useTranslation } from 'react-i18next'

import { authProvider } from './auth-provider'

import { ColorModeContextProvider } from './contexts/color-mode'

import { Header } from '@/components/header'
import { ProductList } from '@/app/products/list'
import { CategoryList } from '@/app/categories/list'

// icons
import DashboardIcon from '@mui/icons-material/Dashboard'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'

export function App() {
  const { t, i18n } = useTranslation()

  const i18nProvider: I18nProvider = {
    translate: (key, params) => t(key, params).toString(),
    changeLocale: (lang: string | undefined) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  }

  return (
    <ColorModeContextProvider>
      <RefineSnackbarProvider>
        <Refine
          dataProvider={dataProvider('https://api.fake-rest.refine.dev')}
          notificationProvider={useNotificationProvider}
          routerProvider={routerProvider}
          authProvider={authProvider}
          i18nProvider={i18nProvider}
          resources={[
            {
              name: 'dashboard',
              list: '/dashboard',
              meta: {
                icon: <DashboardIcon />,
              },
            },
            {
              name: 'store',
              meta: {
                icon: <StorefrontOutlinedIcon />,
              },
            },
            {
              name: 'products',
              meta: {
                parent: 'store',
                icon: false,
              },
              list: '/products',
              create: '/products/new',
              edit: '/products/:id/edit',
              show: '/products/:id',
            },
            {
              name: 'categories',
              list: '/categories',
              create: '/categories/new',
              edit: '/categories/:id/edit',
              show: '/categories/:id',
              meta: {
                parent: 'store',
                icon: false,
                canDelete: true,
              },
            },
          ]}
        >
          <Routes>
            <Route
              element={
                <Authenticated
                  key="authenticated-inner"
                  fallback={<CatchAllNavigate to="/login" />}
                >
                  <ThemedLayoutV2 Header={() => <Header sticky />}>
                    <Outlet />
                  </ThemedLayoutV2>
                </Authenticated>
              }
            >
              <Route
                index
                element={<NavigateToResource resource="dashboard" />}
              />
              <Route path="/dashboard">
                <Route index element={<>alol</>} />
              </Route>
              <Route path="/products">
                <Route index element={<ProductList />} />
                {/* <Route path="new" element={<ProductCreate />} /> */}
                {/* <Route path=":id" element={<ProductShow />} /> */}
                {/* <Route path=":id/edit" element={<ProductEdit />} /> */}
              </Route>
              <Route path="/categories">
                <Route index element={<CategoryList />} />
                {/* <Route path="new" element={<CategoryCreate />} />
                <Route path=":id" element={<CategoryShow />} />
                <Route path=":id/edit" element={<CategoryEdit />} /> */}
              </Route>
              <Route path="*" element={<ErrorComponent />} />
            </Route>
            <Route
              element={
                <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                  <NavigateToResource />
                </Authenticated>
              }
            >
              <Route
                path="/login"
                element={
                  <AuthPage
                    type="login"
                    formProps={{
                      defaultValues: {
                        email: 'demo@refine.dev',
                        password: 'demodemo',
                      },
                    }}
                  />
                }
              />
              <Route path="/register" element={<AuthPage type="register" />} />
              <Route
                path="/forgot-password"
                element={<AuthPage type="forgotPassword" />}
              />
              <Route
                path="/update-password"
                element={<AuthPage type="updatePassword" />}
              />
            </Route>
          </Routes>
        </Refine>
      </RefineSnackbarProvider>
    </ColorModeContextProvider>
  )
}
