import { Navigate } from "react-router-dom";
import { useAuth } from "hooks/auth-status";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuth, role } = useAuth();

    if (role === null) {
        return <div className="text-white p-6">Checking access...</div>;
    }

    if (!isAuth) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;

    return children;
};

export default ProtectedRoute;
