import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import { BrowserRouter } from 'react-router'
import { ErrorBoundary } from 'react-error-boundary'
import './config/i18n.ts'
import './styles/global.css'
import ErrorFallback from './layout/components/ErrorFallback.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { ToastContainer } from 'react-toastify'
import { ConfigProvider } from 'antd'
import theme from './theme/theme.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
        <Provider store={store}>
          <BrowserRouter>
            <ConfigProvider theme={theme}>
              <App />
              <ToastContainer />
            </ConfigProvider>
          </BrowserRouter>
        </Provider>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
)
