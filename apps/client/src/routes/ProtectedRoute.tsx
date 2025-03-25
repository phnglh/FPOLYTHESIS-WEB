import { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useSelector } from 'react-redux'
import { RootState } from '@store/store'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const accessToken =
    useSelector((state: RootState) => state.auth.access_token) ||
    localStorage.getItem('access_token')

  return accessToken ? <Navigate to="/" replace /> : children
}

export default ProtectedRoute
