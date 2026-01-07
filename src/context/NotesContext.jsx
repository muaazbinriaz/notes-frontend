import { createContext, useContext, useState, useEffect } from "react";
import useAuth from "./useAuth";
import API from "../utils/api";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
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

  const updateNoteStatus = async (id, status) => {
    setNotes((prev) => prev.map((n) => (n._id === id ? { ...n, status } : n)));
    try {
      const res = await API.put(`/notes/updateStatus/${id}`, { status });
      if (res.data.success) {
        const updated = res.data.data;
        setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
      }
    } catch (err) {
      console.error("Failed to update note status:", err);
    }
  };
  const taskNotes = notes.filter((n) => n.status === "task");
  const completedNotes = notes.filter((n) => n.status === "completed");

  return (
    <NotesContext.Provider
      value={{ notes, addNote, updateNoteStatus, taskNotes, completedNotes }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
