import { useContext } from "react";
import { AuthContext } from "./AuthProvider.jsx";
const useAuth = () => useContext(AuthContext);
export default useAuth;
