import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const RequireAuth = ({ children }) => {
  const { auth } = useAuth();
  return auth?.token ? children : <Navigate to="/login" replace />;
};

export default RequireAuth;
