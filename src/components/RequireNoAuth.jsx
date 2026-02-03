import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RequireNoAuth = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  return auth?.token ? <Navigate to="/boards" /> : children;
};
export default RequireNoAuth;
