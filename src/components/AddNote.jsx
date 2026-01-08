import { useState } from "react";
import { toast } from "react-toastify";

const AddNote = ({ onAdd, onClose }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return toast.error("Title is required");
    if (!body.trim()) return toast.error("Body is required");

    onAdd({ title, body });
    toast.success("Note added successfully");
    setTitle("");
    setBody("");
    onClose();
  };

  return (
    <div>
      <input
        className="bg-white w-63 pl-2 rounded-lg ml-3.5 py-2.5 mt-2"
        type="text"
        placeholder="Enter a title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="bg-white w-63 pl-2 rounded-lg ml-3.5 py-2.5 mt-2 resize-none"
        rows={3}
        placeholder="Enter a body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <span></span>
      <div className="pl-3.5 pt-2">
        <button
          className="bg-blue-600 text-white py-1 px-2 rounded-md cursor-pointer mr-2"
          onClick={handleAdd}
        >
          Add card
        </button>
        <button
          className="text-lg px-3 py-0.5 hover:bg-amber-200 cursor-pointer rounded-md"
          onClick={onClose}
        >
          x
        </button>
      </div>
    </div>
  );
};

export default AddNote;
