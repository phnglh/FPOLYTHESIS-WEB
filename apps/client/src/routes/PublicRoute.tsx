import { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useSelector } from 'react-redux'
import { RootState } from '@store/store'

interface ProtectedRouteProps {
  children: ReactNode
}

const PublicRoute = ({ children }: ProtectedRouteProps) => {
  const accessToken =
    useSelector((state: RootState) => state.auth.access_token) ||
    localStorage.getItem('access_token')

  // Kiểm tra nếu có accessToken thì redirect về trang chủ (hoặc bất kỳ trang nào bạn muốn)
  if (accessToken) {
    return <Navigate to="/" replace />
  }

  // Nếu không có accessToken thì render children (Login, Register)
  return <>{children}</>
}

export default PublicRoute
