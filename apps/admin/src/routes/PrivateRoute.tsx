import { Navigate } from 'react-router'
import { useSelector } from 'react-redux'
import { RootState } from '@store/store'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isInitialized } = useSelector((state: RootState) => state.auth)

  if (!isInitialized) return null

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default PrivateRoute
