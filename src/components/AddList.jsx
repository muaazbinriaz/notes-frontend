import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useAddListMutation } from "../features/lists/listApi";
import { toast } from "react-toastify";

const AddList = ({ listCount, boardId, refetchLists }) => {
  const [addList, { isLoading }] = useAddListMutation();
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = async () => {
    if (!title.trim() || isLoading) return;
    try {
      await addList({
        title: title.trim(),
        position: listCount,
        boardId,
      }).unwrap();
      await refetchLists();
      toast.success("New list added successfully!");
      setTitle("");
      setIsOpen(false);
    } catch (err) {
      toast.error("Failed to add list");
    }
  };

  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        className="w-72 shrink-0 h-12 flex items-center justify-center cursor-pointer bg-gray-300/30 backdrop-blur-lg  shadow-xl duration-300 text-white rounded-md hover:bg-gray-200/30"
      >
        + Add new list
      </div>
    );
  }

  return (
    <div className="w-72 p-2 bg-gray-200 rounded-md">
      <input
        type="text"
        value={title}
        autoFocus
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter list title"
        className="w-full p-1 rounded border"
      />
      <div className="flex gap-2 mt-2 shrink-0 w-72">
        <button
          className={`bg-[#39393a] cursor-pointer hover:bg-[#2c2c2c] duration-200 text-white px-3 py-1 rounded ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleAdd}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add List"}
        </button>
        <button
          className="text-gray-600 cursor-pointer hover:bg-gray-300 w-8 rounded flex justify-center items-center"
          onClick={() => setIsOpen(false)}
        >
          <RxCross2 className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default AddList;
