import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [completed, setCompleted] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/website/notes/getNotes`,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        setNotes(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      }
    };
    if (auth?.token) fetchNotes();
  }, [auth?.token]);

  const addNote = async (note) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/website/notes/insert`,
        note,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      if (res.data.success) {
        setNotes((prev) => [...prev, res.data.data]);
      }
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  const moveToCompleted = (note) => {
    setNotes((prev) => prev.filter((n) => n._id !== note.id));
    setCompleted((prev) => [...prev, note]);
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, moveToCompleted }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
