import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/services/auth';

export function ProtectedRoute({ element }: { element: React.ReactNode }) {
    if (!isAuthenticated()) {
        const baseUrl = import.meta.env.BASE_URL || '/';
        return <Navigate to={`${baseUrl}login`} replace />;
    }

    return <>{element}</>;
}

export function PublicRoute({ element }: { element: React.ReactNode }) {
    if (isAuthenticated()) {
        const baseUrl = import.meta.env.BASE_URL || '/';
        return <Navigate to={`${baseUrl}organizer`} replace />;
    }
    return <>{element}</>;
}
