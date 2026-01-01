import { useMemo } from "react";

const useAuthenticated = () => {
  const stored = localStorage.getItem("auth");
  const auth = stored ? JSON.parse(stored) : null;

  return useMemo(
    () => ({
      token: auth?.token,
      user: auth?.user,
    }),
    [auth]
  );
};

export default useAuthenticated;
