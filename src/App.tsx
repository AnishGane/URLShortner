import { RouterProvider, createBrowserRouter } from "react-router-dom"
import AppLayout from "./layouts/app-layout"
import LandingPage from "./pages/landing-page"
import AuthPage from "./pages/auth"
import DashboardPage from "./pages/dashboard"
import LinkPage from "./pages/link"
import RedirectLink from "./pages/redirect-link"
import ProtectedRoute from "./components/protected-route"

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />
      }, {
        path: "/auth",
        element: <AuthPage />
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
          <ProtectedRoute>
            <RedirectLink />
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