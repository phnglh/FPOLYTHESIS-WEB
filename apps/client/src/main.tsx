import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import { BrowserRouter } from 'react-router'
import { ErrorBoundary } from 'react-error-boundary'
import './config/i18n.ts'
import './styles/global.css'
import ErrorFallback from './layout/components/ErrorFallback.tsx'
import { Provider } from 'react-redux'
import { persistor, store } from './store/store.ts'
import { ConfigProvider } from 'antd'
import theme from './theme/theme'
import { ToastContainer } from 'react-toastify'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
              <ConfigProvider theme={theme}>
                <App />
                <ToastContainer />
              </ConfigProvider>
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
)
