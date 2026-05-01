import { RouterProvider, createBrowserRouter } from "react-router-dom"
import AppLayout from "./layouts/app-layout"
import LandingPage from "./pages/landing-page"
import AuthPage from "./pages/auth"
import LinkPage from "./pages/link"
import RedirectLink from "./pages/redirect-link"
import ProtectedRoute from "./components/protected-route"
import PublicRoute from "./components/public-route"
import DashboardPage from "./pages/dashboard"
import WarningPage from "./pages/warning-page"
import AuthCallback from "./pages/auth-callback"
import UserProfile from "./pages/user-profile"

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
      }, {
        path: "/warning/:id",
        element: (
          <WarningPage />
        )
      }, {
        path: "/auth/callback",
        element: <AuthCallback />
      }, {
        path: "/me",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        )
      }
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />
}

export default App