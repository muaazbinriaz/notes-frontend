import { useState } from "react";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";

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
        className="bg-white w-63 pl-2 rounded-lg ml-3.5 py-2.5 mt-2 outline-none ring-1 ring-amber-300"
        type="text"
        autoFocus
        placeholder="Enter a title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="bg-white w-63 pl-2 rounded-lg ml-3.5 py-2.5 mt-2 resize-none outline-none ring-1 ring-amber-300"
        rows={3}
        placeholder="Enter a body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <div className="pl-3.5 pt-2 flex">
        <button
          className="bg-blue-500 hover:bg-[#0a7db7] duration-300 font-semibold text-white py-1 px-2.5 rounded-md cursor-pointer mr-2"
          onClick={handleAdd}
        >
          Add card
        </button>
        <button
          className=" cursor-pointer text-xl text-[#01273a] hover:bg-[#529dc2] p-2 rounded"
          onClick={onClose}
        >
          <RxCross2 />
        </button>
      </div>
    </div>
  );
};

export default AddNote;
