import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/services/auth';

export function ProtectedRoute({ element }: { element: React.ReactNode }) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return <>{element}</>;
}

export function PublicRoute({ element }: { element: React.ReactNode }) {
    if (isAuthenticated()) {
        return <Navigate to="/organizer" replace />;
    }
    return <>{element}</>;
}
