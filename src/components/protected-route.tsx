import { useAuthContext } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();

    const { isAuthenticated, loading } = useAuthContext();

    if (!isAuthenticated && !loading) {
        navigate("/auth");
    }

    if (loading) return <Loader2 className="animate-spin size-6" />

    if (isAuthenticated) return children
}

export default ProtectedRoute