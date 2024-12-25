import { ErrorBoundary } from 'react-error-boundary'
import { AppRoutes } from './app-routes'
import ErrorFallback from '../components/ErrorFallback'
import { AppLayout } from '@/app/app-layout'

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </ErrorBoundary>
  )
}
