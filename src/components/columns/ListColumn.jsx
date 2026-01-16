import { useDrop } from "react-dnd";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";
import NoteItem from "../notes/NoteItem";
import NoteForm from "../notes/NoteForm";
import Swal from "sweetalert2";
import { RiDeleteBin6Line } from "react-icons/ri";

import {
  useAddNoteMutation,
  useDeleteNoteMutation,
  useEditNoteMutation,
  useGetNotesQuery,
  useMoveNoteMutation,
} from "../../features/lists/noteApi";
import { useDeleteListMutation } from "../../features/lists/listApi";

const ListColumn = ({ list }) => {
  const { data: notes } = useGetNotesQuery();
  const [addNote] = useAddNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();
  const [editNote] = useEditNoteMutation();
  const [moveNote] = useMoveNoteMutation();
  const [deleteList] = useDeleteListMutation();
  const [isBoxOpen, setIsBoxOpen] = useState(false);

  const listNotes = notes ? notes.filter((n) => n.listId === list._id) : [];

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "Note",
    drop: async (item) => {
      try {
        await moveNote({ noteId: item._id, listId: list._id }).unwrap();
      } catch (err) {
        toast.error("Failed to move note.");
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  const handleAddNote = async (note) => {
    try {
      await addNote({ ...note, listId: list._id }).unwrap();
      toast.success("Note added successfully!");
    } catch (err) {
      toast.error("Failed to add note.");
    }
  };

  const handleDeleteNote = async (id) => {
    const result = await Swal.fire({
      title: "Delete this note?",
      text: "This note will be deleted from this list!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await deleteNote(id).unwrap();
        toast.success("Note deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete note.");
      }
    }
  };

  const handleEditNote = async (id, updated) => {
    try {
      await editNote({ id, updateNote: updated }).unwrap();
      toast.success("Note updated successfully!");
    } catch (err) {
      toast.error("Failed to update note.");
    }
  };

  const handleDeleteList = async () => {
    const result = await Swal.fire({
      title: "Delete this list?",
      text: "All cards in this will also be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await deleteList(list._id).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: "List and its notes deleted.",
          icon: "success",
        });
      } catch (err) {
        toast.error("Failed to delete list", err);
      }
    }
  };

  return (
    <div
      ref={drop}
      className={`bg-[#78afcb] max-w-72 w-full shrink-0 pb-3 rounded-xl max-h-[75vh] ${
        isOver ? "bg-blue-400" : ""
      }`}
    >
      <div className="p-4 flex justify-between ">
        <p className="pl-2 text-[17px] font-semibold text-[#012a3e]">
          {list.title}
        </p>
        <button onClick={handleDeleteList} className="cursor-pointer pr-2">
          <RiDeleteBin6Line className="size-5 text-white" />
        </button>
      </div>

      {listNotes.length > 0 ? (
        <div className="overflow-scroll max-h-[55vh] scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ul className="w-68 mx-auto flex flex-col gap-2 ">
            {listNotes.map((note) => (
              <NoteItem
                key={note._id}
                note={note}
                onDelete={() => handleDeleteNote(note._id)}
                onEdit={(updated) => handleEditNote(note._id, updated)}
              />
            ))}
            {isBoxOpen && (
              <NoteForm
                onSubmit={(note) => handleAddNote(note)}
                onClose={() => setIsBoxOpen(false)}
              />
            )}
          </ul>
        </div>
      ) : (
        <p className="text-white px-4 text-lg pb-1 italic">No notes</p>
      )}

      <div
        onClick={() => setIsBoxOpen(true)}
        className="w-68 pl-2 py-1.5 mx-auto mt-5 flex items-center gap-2 hover:bg-[#5b97b5] rounded-lg cursor-pointer"
      >
        <span className="text-[20px]">
          <IoMdAdd className="text-[#012131]" />
        </span>
        <span className="font-medium text-[#012a3e]">Add a card</span>
      </div>
    </div>
  );
};

export default ListColumn;
