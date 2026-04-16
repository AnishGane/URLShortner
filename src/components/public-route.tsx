import { useAuthContext } from "@/context/auth-context"
import { Navigate, useLocation } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthContext();
    const location = useLocation();

    if (isAuthenticated) {
        const params = location.search;
        return <Navigate to={`/dashboard${params}`} replace />;
    }
    return children;
}

export default PublicRoute