import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { toast } from "react-toastify";

const NewNotes = ({ notes, setNotes }) => {
  const [notesTitle, setNotesTitle] = useState("");
  const [notesBody, setNotesBody] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");
  const editingNote = notes.find((note) => note._id == id);

  useEffect(() => {
    if (id && editingNote) {
      setNotesTitle(editingNote.title);
      setNotesBody(editingNote.body);
    }
  }, [editingNote, id]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const handleAdd = async () => {
    if (!notesTitle.trim() || !notesBody.trim()) {
      toast.error("Both fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/website/notes/insert`,
        { title: notesTitle, body: notesBody },
        { headers: getAuthHeader() }
      );
      toast.success("Note added successfully");
      setNotes([...notes, response.data]);
      navigate("/home");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Error adding note");
      navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    Swal.fire({
      title: "Do you want to delete the note?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "red",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(
            `${
              import.meta.env.VITE_BASE_URL
            }/api/website/notes/deleteNote/${id}`,
            { headers: getAuthHeader() }
          );
          if (res.data.status === 1) {
            setNotes(notes.filter((note) => note._id !== id));
            toast.success("Note deleted successfully");
            navigate("/home");
          } else {
            toast.error("Note not found in database");
            navigate("/home");
          }
        } catch (err) {
          console.error(err);
          toast.error("Error deleting note");
          navigate("/home");
        }
      } else if (result.isDenied) {
        Swal.fire("Note is not deleted", "", "info");
      }
    });
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/website/notes/updateNote/${id}`,
        { title: notesTitle, body: notesBody },
        { headers: getAuthHeader() }
      );

      if (res.data.status === 1) {
        setNotes(
          notes.map((note) => (note._id === id ? res.data.updatedNote : note))
        );
        toast.success("Note updated successfully", {
          onClose: () => navigate("/home"),
        });
      } else {
        toast.error("Note not found");
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating note");
      navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <span className="border-blue-500 h-16 w-16 animate-spin rounded-full border-t-4"></span>
        </div>
      ) : (
        <div>
          <div className="bg-[#F7F7F7] text-[20px] p-3.5 flex flex-wrap justify-between px-110 ">
            <Link
              className=" text-[#105273] hover:text-[#437993] duration-300 "
              to="/home"
            >
              Home
            </Link>
            <div>
              {editingNote && (
                <span className="text-[#105273] text-[17px] ">
                  Last Edited :{" "}
                  <span className="">
                    {(() => {
                      const timeDiff =
                        new Date() - new Date(editingNote.updatedAt);
                      const seconds = Math.floor(timeDiff / 1000);
                      const minutes = Math.floor(seconds / 60);
                      const hours = Math.floor(minutes / 60);
                      const days = Math.floor(hours / 24);
                      if (seconds < 60) {
                        return `${seconds} seconds ago`;
                      }
                      if (minutes < 60) {
                        return `${minutes} minutes ago`;
                      }
                      if (hours < 24) {
                        return `${hours} hours ago`;
                      }
                      return `${days} days ago`;
                    })()}{" "}
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 mx-auto max-w-175 w-full mt-5 p-5">
            <div>
              <input
                type="text"
                placeholder="Type your Notes title"
                className="bg-[#F7F7F7] py-2.5 px-3 text-[18px] rounded max-w-175 w-full"
                onChange={(e) => setNotesTitle(e.target.value)}
                value={notesTitle}
              />
            </div>

            <div>
              <textarea
                placeholder="Type your Notes body"
                rows={4}
                className="bg-[#F7F7F7] py-2.5 px-3 resize-none text-[18px] rounded max-w-175 w-full"
                onChange={(e) => setNotesBody(e.target.value)}
                value={notesBody}
              ></textarea>
            </div>

            {id === null ? (
              <div>
                <button
                  className="border rounded-md bg-[#437993] p-2.5 text-white hover:bg-[#055f8c] duration-500 cursor-pointer"
                  onClick={handleAdd}
                >
                  Add Note
                </button>
              </div>
            ) : (
              <div className="flex justify-between gap-2">
                <button
                  className="border rounded-md bg-[#437993] p-2.5 text-white hover:bg-[#055f8c] duration-500 cursor-pointer"
                  onClick={handleRemove}
                >
                  Remove Note
                </button>
                <button
                  className="border rounded-md bg-[#437993] p-2.5 text-white hover:bg-[#055f8c] duration-500 cursor-pointer"
                  onClick={handleEdit}
                >
                  Update Note
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NewNotes;
