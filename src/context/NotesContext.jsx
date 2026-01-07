import { createContext, useContext, useState, useEffect } from "react";
import useAuth from "./useAuth";
import API from "../utils/api";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [completed, setCompleted] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await API.get("/notes/getNotes");
        setNotes(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      }
    };
    if (auth?.token) fetchNotes();
  }, [auth?.token]);

  const addNote = async (note) => {
    try {
      const res = await API.post("/notes/insert", note);
      if (res.data.success) {
        setNotes((prev) => [...prev, res.data.data]);
      }
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  const moveToCompleted = (note) => {
    setNotes((prev) => prev.filter((n) => n._id !== note._id));
    setCompleted((prev) => [...prev, note]);
  };

  const moveToTasks = (note) => {
    setCompleted((prev) => prev.filter((n) => n._id !== note._id));
    setNotes((prev) => [...prev, note]);
  };

  return (
    <NotesContext.Provider
      value={{ notes, completed, addNote, moveToCompleted, moveToTasks }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
