import { createContext, useContext, useState, useEffect } from "react";
import useAuth from "./useAuth";
import API from "../utils/api";
import { toast } from "react-toastify";

const ListsContext = createContext();

export const ListsProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await API.get("/lists");
        if (res.data.success) setLists(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch lists:", err);
      }
    };
    if (auth?.token) fetchLists();
  }, [auth?.token]);

  const addList = async (title) => {
    try {
      const res = await API.post("/lists", { title });
      if (res.data.success) {
        setLists((prev) => [...prev, res.data.data]);
        toast.success("List added");
      }
    } catch (err) {
      console.error("Error adding list:", err);
    }
  };
  return (
    <ListsContext.Provider value={{ lists, setLists, addList }}>
      {children}
    </ListsContext.Provider>
  );
};

export const useLists = () => useContext(ListsContext);
