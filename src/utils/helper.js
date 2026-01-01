export const getAuthHeader = () => {
  const stored = localStorage.getItem("auth");
  const auth = stored ? JSON.parse(stored) : null;

  return {
    headers: {
      Authorization: `Bearer ${auth?.token}`,
    },
  };
};
