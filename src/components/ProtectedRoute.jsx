import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const stored = localStorage.getItem("auth");
  const auth = stored ? JSON.parse(stored) : null;

  if (!auth?.token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
