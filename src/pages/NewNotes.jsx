import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

const NewNotes = ({ notes, setNotes }) => {
  const [notesTitle, setNotesTitle] = useState("");
  const [notesBody, setNotesBody] = useState("");

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

  const handleAdd = async () => {
    if (!notesTitle.trim() || !notesBody.trim())
      return alert("Both fields are required");
    try {
      const response = await axios.post(
        `http://localhost:8000/api/website/notes/insert`,
        {
          title: notesTitle,
          body: notesBody,
        }
      );
      navigate("/");
      setNotes([...notes, response.data]);
      toast.success("Note added successfully");
    } catch (err) {
      alert(err);
    }
  };

  const handleRemove = async () => {
    Swal.fire({
      title: "Do you want to delete the note?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(
            `http://localhost:8000/api/website/notes/deleteNote/${id}`
          );

          if (res.data.status === 1) {
            setNotes(notes.filter((note) => note._id !== id));
            navigate("/");
            Swal.fire("Deleted!", "", "success");
          } else {
            Swal.fire("Note not found in database", "", "error");
          }
        } catch (err) {
          Swal.fire("Error deleting note", "", "error");
          console.error(err);
        }
      } else if (result.isDenied) {
        Swal.fire("Note is not deleted", "", "info");
      }
    });
  };

  const handleEdit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/website/notes/updateNote/${id}`,
        {
          title: notesTitle,
          body: notesBody,
        }
      );

      if (res.data.status === 1) {
        setNotes(
          notes.map((note) => (note._id === id ? res.data.updatedNote : note))
        );
        navigate("/");
        toast.success("Note updated successfully");
      } else {
        alert("Note not found");
      }
    } catch (err) {
      alert("Error updating note");
      console.error(err);
    }
  };

  return (
    <>
      <div className="bg-[#F7F7F7]  text-[20px] p-3.5 flex">
        <Link
          className=" max-w-175 w-full text-[#105273] hover:text-[#437993] duration-300 mx-auto"
          to="/"
        >
          Home
        </Link>
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
              className="border rounded-md bg-[#437993] p-2.5 text-white hover:bg-black duration-500 cursor-pointer"
              onClick={handleAdd}
            >
              Add Note
            </button>
          </div>
        ) : (
          <div className="flex justify-between gap-2">
            <button
              className="border rounded-md bg-[#437993] p-2.5 text-white hover:bg-black duration-500 cursor-pointer"
              onClick={handleRemove}
            >
              Remove Note
            </button>
            <button
              className="border rounded-md bg-[#437993] p-2.5 text-white hover:bg-black duration-500 cursor-pointer"
              onClick={handleEdit}
            >
              Update Note
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NewNotes;
