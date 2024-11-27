import { Link, Navigate, useRoutes } from "react-router-dom";

export function AppRoutes() {
  return useRoutes([
    {
      path: "/admin",
      children: [
        {
          index: true,
          element: <Navigate replace to="dashboard" />,
        },
        {
          path: "dashboard",
          element: <h1>Dashboard</h1>,
        },
        {
          path: "customer",
          element: <h1>Customer</h1>,
        },
        {
          path: "users",
          element: (
            <div>
              <p>Users page management</p>
              <Link to="/customer">Customer</Link>
            </div>
          ),
        },
      ],
    },
  ]);
}
