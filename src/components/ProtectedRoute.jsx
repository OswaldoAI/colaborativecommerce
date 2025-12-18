import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && user.role !== requiredRole && user.role !== 'SUPERADMIN') {
        return <Navigate to="/" replace />;
    }

    return children;
};
