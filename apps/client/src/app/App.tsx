import { ErrorBoundary } from 'react-error-boundary'
import { AppLayout } from './app-layout'
import { AppRoutes } from './app-routes'
import ErrorFallback from '../components/ErrorFallback'

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </ErrorBoundary>
  )
}
