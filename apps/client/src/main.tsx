import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import { BrowserRouter } from 'react-router'
import ErrorFallback from './layout/components/ErrorFallback.tsx'
import theme from './theme.ts'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { ErrorBoundary } from 'react-error-boundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div>Loading...</div>}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Suspense>
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>,
)
