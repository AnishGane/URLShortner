import { useAuthContext } from '@/context/auth-context';
import React from 'react'
import { Navigate } from 'react-router-dom'
import { Skeleton } from './ui/skeleton';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {

    const { isAuthenticated, loading } = useAuthContext();

    if (!isAuthenticated && !loading) {
        return <Navigate to="/auth" replace />
    }

    if (loading) return <ProtectedRouteSkeleton />

    if (isAuthenticated) return children

    return null
}

const ProtectedRouteSkeleton = () => {
    return (
        <div className='py-6'>
            <Skeleton className='animate-pulse rounded-lg h-60' />
        </div>
    )
}
export default ProtectedRoute