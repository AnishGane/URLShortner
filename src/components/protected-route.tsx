import { useAuthContext } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';
import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {

    const { isAuthenticated, loading } = useAuthContext();

    if (!isAuthenticated && !loading) {
        return <Navigate to="/auth" replace />
    }

    if (loading) return <Loader2 className="animate-spin size-6" />

    if (isAuthenticated) return children

    return null
}
export default ProtectedRoute