import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { FaPaperclip } from "react-icons/fa";

const TITLE_LIMIT = 60;
const BODY_LIMIT = 500;
const NoteForm = ({ initialData, onSubmit, onClose }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [titleCount, setTitleCount] = useState(0);
  const [bodyCount, setBodyCount] = useState(0);
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setBody(initialData.body);
      setTitleCount(initialData.title.length);
      setBodyCount(initialData.body.length);
      if (initialData.picture) {
        setPreviewUrl(initialData.picture);
      }
    }
  }, [initialData]);

  const submit = () => {
    if (!title.trim()) return toast.error("Title is required");
    if (!body.trim()) return toast.error("Body is required");
    onSubmit({
      title,
      body,
      imageFile,
      picture: previewUrl || (initialData ? initialData.picture : null),
    });
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col justify-center items-center ">
      {previewUrl && (
        <img
          src={previewUrl}
          alt="preview"
          className="w-68 rounded-lg mb-2 mt-3"
        />
      )}
      <div className="relative">
        <input
          className="bg-gray-700 text-gray-300 w-68 p-2 rounded-lg  py-2.5 mt-2 outline-none ring-2 ring-gray-500"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleCount(e.target.value.length);
          }}
          maxLength={TITLE_LIMIT}
          autoFocus
        />
        <span className="absolute bottom-0 right-2 text-sm text-gray-300">
          {titleCount} / {TITLE_LIMIT}
        </span>
      </div>
      <div className="relative">
        <textarea
          className="bg-gray-700 text-gray-300 w-68 p-2 rounded-lg  py-2.5 mt-2 resize-none outline-none ring-2 ring-gray-500"
          rows={3}
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            setBodyCount(e.target.value.length);
          }}
          maxLength={BODY_LIMIT}
        />
        <span className="absolute bottom-1.5 right-2 text-sm text-gray-300">
          {bodyCount} / {BODY_LIMIT}
        </span>
      </div>
      <div className=" pt-2 flex flex-col-reverse">
        <div className="flex justify-center">
          <button
            className=" text-lg text-gray-300 cursor-pointer p-2 rounded"
            onClick={() => fileInputRef.current.click()}
          >
            <FaPaperclip />
          </button>

          <button
            className="bg-gray-600 hover:bg-gray-700 duration-300 cursor-pointer font-semibold text-white py-1 px-4 rounded-md mr-2"
            onClick={submit}
          >
            {initialData ? "Save" : "Add card"}
          </button>

          <button
            className="text-xl text-gray-300 cursor-pointer hover:bg-gray-600 p-2 rounded"
            onClick={onClose}
          >
            <RxCross2 />
          </button>
        </div>

        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default NoteForm;
