import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

export function ProtectedRoute({ children }) {
    const { user, loading } = useContext(AuthContext);
    if (loading) return null; // or a spinner
    if (!user) return <Navigate to="/login" replace />;
    return children;
}

export function RoleRoute({ children, allowedRoles }) {
    const { user, loading } = useContext(AuthContext);
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
}