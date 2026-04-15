import { useAuthContext } from "@/context/auth-context"
import { Loader2 } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading } = useAuthContext();
    const location = useLocation();

    if (loading) return <Loader2 className="animate-spin size-6" />;

    if (isAuthenticated) {
        const params = location.search;
        return <Navigate to={`/dashboard${params}`} replace />;
    }
    return children;
}

export default PublicRoute