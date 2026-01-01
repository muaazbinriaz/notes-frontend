import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useAuthenticated = () => {
  const navigate = useNavigate();

  const stored = localStorage.getItem("auth");
  const auth = stored ? JSON.parse(stored) : null;

  useEffect(() => {
    if (!auth?.token) {
      navigate("/");
    } else {
      navigate("/home");
    }
  }, [auth?.token, navigate]);

  return {
    token: auth?.token,
    user: auth?.user,
  };
};

export default useAuthenticated;
