import { Navigate } from "react-router-dom";
import useAuthenticated from "../customHooks/useAuthenticated";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuthenticated();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
