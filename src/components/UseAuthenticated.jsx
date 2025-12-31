import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const UseAuthenticated = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);
};

export default UseAuthenticated;
