import { Link, Navigate, useRoutes } from 'react-router-dom'
import { NotFound } from '../components/not-found'

export function AppRoutes() {
  return useRoutes([
    {
      index: true,
      element: <Navigate replace to="/dashboard" />,
    },
    {
      path: '/dashboard',
      element: <h1 className="text-2xl text-pink-500">Dashboard</h1>,
    },
    {
      path: '/customers',
      element: <h1>Customer</h1>,
    },
    {
      path: '/users',
      element: (
        <div>
          <p>Users page management</p>
          <Link to="/customer">Customer</Link>
        </div>
      ),
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ])
}
