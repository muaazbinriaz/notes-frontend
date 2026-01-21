import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useAddListMutation } from "../features/lists/listApi";
import { toast } from "react-toastify";

const AddList = ({ listCount }) => {
  const [addList] = useAddListMutation();
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addList({ title: title.trim(), position: listCount }).unwrap();
    toast.success("New list added successfully!");
    setTitle("");
    setIsOpen(false);
  };
  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        className="w-72 shrink-0 h-12 flex items-center justify-center cursor-pointer bg-gray-200 rounded-md hover:bg-gray-300"
      >
        + Add new list
      </div>
    );
  }
  return (
    <div className="w-72 p-2 bg-gray-100 rounded-md">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter list title"
        className="w-full p-1 rounded border"
      />
      <div className="flex gap-2 mt-2 shrink-0 w-72">
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
          onClick={handleAdd}
        >
          Add List
        </button>
        <button className="text-gray-600" onClick={() => setIsOpen(false)}>
          <RxCross2 />
        </button>
      </div>
    </div>
  );
};

export default AddList;
