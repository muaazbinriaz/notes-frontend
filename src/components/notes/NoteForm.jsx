import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";

const TITLE_LIMIT = 60;
const BODY_LIMIT = 500;
const NoteForm = ({ initialData, onSubmit, onClose }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [titleCount, setTitleCount] = useState(0);
  const [bodyCount, setBodyCount] = useState(0);
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setBody(initialData.body);
      setTitleCount(initialData.title.length);
      setBodyCount(initialData.body.length);
    }
  }, [initialData]);
  const submit = () => {
    if (!title.trim()) return toast.error("Title is required");
    if (!body.trim()) return toast.error("Body is required");
    onSubmit({ title, body });
    onClose();
  };

  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="relative">
        <input
          className="bg-white w-68 p-2 rounded-lg  py-2.5 mt-2 outline-none ring-1 ring-amber-300"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleCount(e.target.value.length);
          }}
          maxLength={TITLE_LIMIT}
          autoFocus
        />
        <span className="absolute bottom-0 right-5 text-sm text-gray-600">
          {titleCount} / {TITLE_LIMIT}
        </span>
      </div>

      <div className="relative">
        <textarea
          className="bg-white w-68 p-2 rounded-lg  py-2.5 mt-2 resize-none outline-none ring-1 ring-amber-300"
          rows={3}
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            setBodyCount(e.target.value.length);
          }}
          maxLength={BODY_LIMIT}
        />
        <span className="absolute bottom-1 right-5 text-sm text-gray-600">
          {bodyCount} / {BODY_LIMIT}
        </span>
      </div>

      <div className=" pt-2 flex ">
        <button
          className="bg-blue-500 hover:bg-[#0a7db7] duration-300 font-semibold text-white py-1 px-4 rounded-md mr-2"
          onClick={submit}
        >
          {initialData ? "Save" : "Add card"}
        </button>
        <button
          className="text-xl text-[#01273a] hover:bg-[#529dc2] p-2 rounded"
          onClick={onClose}
        >
          <RxCross2 />
        </button>
      </div>
    </div>
  );
};

export default NoteForm;
