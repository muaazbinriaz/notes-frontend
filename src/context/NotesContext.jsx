import { createContext, useContext, useState, useEffect } from "react";
import useAuth from "./useAuth";
import API from "../utils/api";
import { toast } from "react-toastify";

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
        toast.success("Note added successfully");
      }
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  const deleteNote = async (id) => {
    try {
      const res = await API.delete(`/notes/deleteNote/${id}`);
      if (res.data.success) {
        setNotes((prev) => prev.filter((n) => n._id !== id));
        toast.success("Note deleted successfully");
      }
    } catch (err) {
      console.log("Error deleting note:", err);
    }
  };

  const editNote = async (id, updateNote) => {
    try {
      const res = await API.put(`/notes/updateNote/${id}`, updateNote);
      if (res.data.success) {
        const updated = res.data.data;

        setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));

        toast.success("Note updated successfully");
      }
    } catch (err) {
      console.log("Error editing note", err);
    }
  };

  const moveNote = async (noteId, listId) => {
    try {
      setNotes((prev) =>
        prev.map((n) => (n._id === noteId ? { ...n, listId } : n))
      );
      const res = await API.put(`/notes/move/${noteId}`, { listId });
      if (res.data.success) {
        const updated = res.data.data;
        setNotes((prev) => prev.map((n) => (n._id === noteId ? updated : n)));
      }
    } catch (err) {
      console.error("Failed to move note:", err);
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        moveNote,
        deleteNote,
        editNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
