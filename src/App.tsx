import { RouterProvider, createBrowserRouter } from "react-router-dom"
import AppLayout from "./layouts/app-layout"
import LandingPage from "./pages/landing-page"
import AuthPage from "./pages/auth"
import DashboardPage from "./pages/dashboard"
import LinkPage from "./pages/link"
import RedirectLink from "./pages/redirect-link"

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
        element: <DashboardPage />
      }, {
        path: "/link/:id",
        element: <LinkPage />
      }, {
        path: "/:id",
        element: <RedirectLink />
      }
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />
}

export default App