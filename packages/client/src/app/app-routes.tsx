import { Link, Navigate, useRoutes } from "react-router-dom";
import { Home } from "./home";
import { NotFound } from "../components/not-found";
import { Login } from "@/app/login";

export function AppRoutes() {
  return useRoutes([
    {
      index: true,
      element: <Navigate replace to="/home" />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/collection",
      element: <h1>collection</h1>,
    },
    {
      path: "/contact",
      element: (
        <div>
          <p>Contact page content</p>
          <Link to="/collection">Collection</Link>
        </div>
      ),
    },
    {
      path: "/customer/login",
      element: <Login />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
}
