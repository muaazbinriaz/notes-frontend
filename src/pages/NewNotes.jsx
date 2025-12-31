import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { toast } from "react-toastify";
import RoundedLoader from "../components/RoundedLoader";
import { getAuthHeader } from "../utils/helper";

const NewNotes = () => {
  const titleLimit = 100;
  const bodyLimit = 1000;

  const [notes, setNotes] = useState([]);
  const [titleCount, setTitleCount] = useState(0);
  const [bodyCount, setBodyCount] = useState(0);
  const [isTitleLimit, setIsTitleLimit] = useState(false);
  const [isBodyLimit, setIsBodyLimit] = useState(false);

  const [notesTitle, setNotesTitle] = useState("");
  const [notesBody, setNotesBody] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchNote = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/website/notes/getNoteById/${id}`,
          { headers: getAuthHeader() }
        );
        const note = response.data.data;
        setEditingNote(note);
        setNotesTitle(note.title);
        setNotesBody(note.body);
        setTitleCount(note.title.length);
        setBodyCount(note.body.length);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  useEffect(() => {
    if (id && editingNote) {
      setNotesTitle(editingNote.title);
      setNotesBody(editingNote.body);
      setTitleCount(editingNote.title.length);
      setBodyCount(editingNote.body.length);
    }
  }, [editingNote, id]);

  const onTitleTextChange = (e) => {
    const count = e.target.value.length;
    setTitleCount(count);
    setIsTitleLimit(count > titleLimit);
    setNotesTitle(e.target.value);
  };

  const onBodyTextChange = (e) => {
    const count = e.target.value.length;
    setBodyCount(count);
    setIsBodyLimit(count > bodyLimit);
    setNotesBody(e.target.value);
  };

  const handleAdd = async () => {
    if (!notesTitle.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!notesBody.trim()) {
      toast.error("Body is required");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/website/notes/insert`,
        { title: notesTitle, body: notesBody },
        { headers: getAuthHeader() }
      );

      if (response.data.success) {
        setNotes([...notes, response.data.data]);
        toast.success("Note added successfully");
        navigate("/home");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Error adding note");
      navigate("/home");
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
        setLoading(true);
        try {
          const res = await axios.delete(
            `${
              import.meta.env.VITE_BASE_URL
            }/api/website/notes/deleteNote/${id}`,
            { headers: getAuthHeader() }
          );

          if (res.data.success) {
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
      }
    });
  };

  const handleEdit = async () => {
    if (!notesTitle.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!notesBody.trim()) {
      toast.error("Body is required");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/website/notes/updateNote/${id}`,
        { title: notesTitle, body: notesBody },
        { headers: getAuthHeader() }
      );

      if (res.data.success) {
        setNotes(notes.map((note) => (note._id === id ? res.data.data : note)));
        toast.success("Note updated successfully");
        navigate("/home");
      } else {
        toast.error("Note not found");
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating note");
      navigate("/home");
    }
  };

  return (
    <>
      {loading ? (
        <RoundedLoader />
      ) : (
        <div>
          <div className="bg-[#F7F7F7] text-[20px] p-3.5 flex flex-wrap justify-between px-10 md:px-34 lg:px-52 xl:px-110 max-w-390 w-full mx-auto">
            <Link
              className=" text-[#105273] hover:text-[#437993] duration-300"
              to="/home"
            >
              Home
            </Link>
            <div>
              {editingNote && (
                <span className="text-[#105273] text-[17px] ">
                  Last Edited :{" "}
                  <span>
                    {(() => {
                      const timeDiff =
                        new Date() - new Date(editingNote.updatedAt);
                      const seconds = Math.floor(timeDiff / 1000);
                      const minutes = Math.floor(seconds / 60);
                      const hours = Math.floor(minutes / 60);
                      const days = Math.floor(hours / 24);
                      if (seconds < 60) return `${seconds} seconds ago`;
                      if (minutes < 60) return `${minutes} minutes ago`;
                      if (hours < 24) return `${hours} hours ago`;
                      return `${days} days ago`;
                    })()}
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 mx-auto max-w-175 w-full mt-5 p-5">
            <div className="relative">
              <input
                type="text"
                placeholder="Type your Notes title"
                className="bg-[#F7F7F7] py-5.5  px-3 text-[18px] rounded max-w-175 w-full focus:outline-gray-300"
                onChange={onTitleTextChange}
                value={notesTitle}
                maxLength={titleLimit}
              />
              <span className="absolute bottom-1 right-2 text-[15px] text-[#105273]">
                {titleCount} / {titleLimit}
              </span>
            </div>

            <div className="relative">
              <textarea
                placeholder="Type your Notes body"
                rows={4}
                className="bg-[#F7F7F7] py-5.5 px-3 resize-none text-[18px] rounded max-w-175 w-full  focus:outline-gray-300"
                onChange={onBodyTextChange}
                value={notesBody}
                maxLength={bodyLimit}
              />
              <span className="absolute bottom-2 right-4 text-[15px] text-[#105273]">
                {bodyCount} / {bodyLimit}
              </span>
            </div>

            {id === null ? (
              <button
                className="border rounded-md bg-[#437993] p-2.5 text-white hover:bg-[#055f8c] duration-500 cursor-pointer"
                onClick={() => !(isTitleLimit || isBodyLimit) && handleAdd()}
                disabled={isTitleLimit || isBodyLimit}
              >
                Add Note
              </button>
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
                  disabled={isTitleLimit || isBodyLimit}
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
