import { Navigate } from "react-router";

export const ProtectedRoute = ({ user, loading, children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }
  return children;
}
