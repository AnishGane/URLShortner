import { RouterProvider, createBrowserRouter } from "react-router-dom"
import AppLayout from "./layouts/app-layout"
import LandingPage from "./pages/landing-page"
import AuthPage from "./pages/auth"
import LinkPage from "./pages/link"
import RedirectLink from "./pages/redirect-link"
import ProtectedRoute from "./components/protected-route"
import PublicRoute from "./components/public-route"
import DashboardPage from "./pages/dashboard"

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        )
      }, {
        path: "/auth",
        element: (
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        )
      }, {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        )
      }, {
        path: "/link/:id",
        element: (
          <ProtectedRoute>
            <LinkPage />
          </ProtectedRoute>
        )
      }, {
        path: "/:id",
        element: (
          <RedirectLink />
        )
      }
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />
}

export default App