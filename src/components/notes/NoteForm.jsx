import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { FaPaperclip } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const TITLE_LIMIT = 60;
const BODY_LIMIT = 500;

const NoteForm = ({ initialData, onSubmit, onClose, onDelete }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [titleCount, setTitleCount] = useState(0);
  const [bodyCount, setBodyCount] = useState(0);
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setBody(initialData.body || "");
      setTitleCount((initialData.title || "").length);
      setBodyCount((initialData.body || "").length);
      if (initialData.picture) {
        setPreviewUrl(initialData.picture);
      }
    }
  }, [initialData]);

  const submit = () => {
    if (!title.trim()) return toast.error("Title is required");
    const payload = {
      title: title.trim(),
      body: body.trim(),
      imageFile,
      picture: previewUrl || (initialData ? initialData.picture : null),
    };

    onSubmit(payload);
    if (!initialData) {
      onClose();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (!initialData) {
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
            placeholder="Enter card title"
          />
          <span className="absolute bottom-0 right-2 text-sm text-gray-300">
            {titleCount} / {TITLE_LIMIT}
          </span>
        </div>
        <div className=" pt-7 pb-1.5 flex flex-col-reverse">
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
              Add card
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
            accept="image/*"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-end mb-5">
        <button
          className="text-xl text-gray-300 hover:bg-gray-600 p-2 rounded cursor-pointer"
          onClick={onClose}
        >
          <RxCross2 />
        </button>
      </div>
      {previewUrl && (
        <div className="mb-4 relative">
          <img src={previewUrl} alt="preview" className="w-full rounded-lg" />
        </div>
      )}
      <div className="mb-4">
        <div className="relative">
          <input
            className="bg-gray-700 text-gray-300 w-full p-3 text-lg font-semibold rounded-lg outline-none ring-2 ring-gray-500"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleCount(e.target.value.length);
            }}
            placeholder="Enter card title"
            maxLength={TITLE_LIMIT}
          />
          <span className="absolute bottom-1 right-2 text-xs text-gray-400">
            {titleCount} / {TITLE_LIMIT}
          </span>
        </div>
      </div>
      <div className="mb-4">
        <label className="text-gray-300 text-sm font-semibold mb-2 block">
          Description
        </label>
        <div className="relative">
          <textarea
            className="bg-gray-700 text-gray-300 w-full p-3 rounded-lg resize-none outline-none ring-2 ring-gray-500 "
            rows={5}
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              setBodyCount(e.target.value.length);
            }}
            placeholder="Add a more detailed description..."
            maxLength={BODY_LIMIT}
          />
          <span className="absolute bottom-2 right-2 text-xs text-gray-400">
            {bodyCount} / {BODY_LIMIT}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-600">
        <button
          className="text-gray-300 hover:bg-gray-600 p-2 rounded flex items-center gap-2 cursor-pointer"
          onClick={() => fileInputRef.current.click()}
          title="Attach image"
        >
          <FaPaperclip className="size-4 " />
          <span className="text-sm">Attachment</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded cursor-pointer"
            onClick={submit}
          >
            Save
          </button>

          <button
            className=" cursor-pointer bg-red-700 hover:bg-red-600 text-white py-2.5 px-4 font-medium rounded flex items-center gap-2 duration-200"
            onClick={onDelete}
            title="Delete card"
          >
            <span className="text-sm">Delete</span>
          </button>
        </div>
      </div>

      <input
        type="file"
        hidden
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default NoteForm;
