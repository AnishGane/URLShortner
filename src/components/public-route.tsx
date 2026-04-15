import { useAuthContext } from "@/context/auth-context"
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading } = useAuthContext();

    if (loading) return <Loader2 className="animate-spin size-6" />;

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}

export default PublicRoute