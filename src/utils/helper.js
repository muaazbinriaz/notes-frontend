export const getAuthHeader = () => {
  const stored = localStorage.getItem("auth");
  const auth = stored ? JSON.parse(stored) : null;

  if (!auth?.token) {
    return { headers: {} };
  }

  return {
    headers: { Authorization: `Bearer ${auth.token}` },
  };
};
