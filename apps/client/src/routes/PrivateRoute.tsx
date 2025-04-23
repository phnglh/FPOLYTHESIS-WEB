import { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useSelector } from 'react-redux'
import { RootState } from '@store/store'

interface ProtectedRouteProps {
  children: ReactNode
}

const PrivateRoute = ({ children }: ProtectedRouteProps) => {
  const accessToken =
    useSelector((state: RootState) => state.auth.access_token) ||
    localStorage.getItem('access_token')

  // Kiểm tra nếu chưa có accessToken thì redirect về login
  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  // Nếu có accessToken thì render children (AccountLayout)
  return <>{children}</>
}

export default PrivateRoute
