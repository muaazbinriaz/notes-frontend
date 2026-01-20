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
import RoundedLoader from "../RoundedLoader";

const ListColumn = ({ list }) => {
  const { data: notes } = useGetNotesQuery();
  const [addNote] = useAddNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();
  const [editNote] = useEditNoteMutation();
  const [moveNote] = useMoveNoteMutation();
  const [deleteList] = useDeleteListMutation();
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const listNotes = notes
    ? notes
        .filter((n) => n.listId === list._id)
        .sort((a, b) => a.position - b.position)
    : [];

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "Note",
    drop: async (item) => {
      try {
        await moveNote({
          noteId: item._id,
          listId: list._id,
          position: item.position,
        }).unwrap();
      } catch (err) {
        console.log("note");
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  const handleAddNote = async (note) => {
    setLoading(true);
    try {
      await addNote({ ...note, listId: list._id }).unwrap();
      setIsBoxOpen(false);
      toast.success("Note added successfully!");
    } catch (err) {
      toast.error("Failed to add note.");
    } finally {
      setLoading(false);
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
      setLoading(true);
      try {
        await deleteNote(id).unwrap();
        toast.success("Note deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete note.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditNote = async (id, updated) => {
    setLoading(true);
    try {
      await editNote({ id, updateNote: updated }).unwrap();
      toast.success("Note updated successfully!");
    } catch (err) {
      toast.error("Failed to update note.");
    } finally {
      setLoading(false);
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
      setLoading(true);
      try {
        await deleteList(list._id).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: "List and its notes deleted.",
          icon: "success",
        });
      } catch (err) {
        toast.error("Failed to delete list", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      ref={drop}
      className={`bg-[#78afcb] max-w-72 w-full shrink-0 pb-3 rounded-xl ${
        isOver ? "bg-blue-400" : ""
      }`}
    >
      <div className="p-4 flex justify-between ">
        <p className="pl-2 text-[17px] font-semibold text-[#012a3e]">
          {list.title}
        </p>
        <button onClick={handleDeleteList} className="cursor-pointer pr-2">
          <RiDeleteBin6Line className="size-5 text-white hover:text-red-600 duration-200" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <RoundedLoader />
        </div>
      ) : listNotes.length > 0 ? (
        <div className="overflow-scroll max-h-[calc(100vh-260px)] scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ul className="max-w-68 w-full mx-auto flex flex-col gap-2 ">
            {listNotes.map((note, index) => (
              <NoteItem
                key={note._id}
                note={note}
                index={index}
                onDelete={() => handleDeleteNote(note._id)}
                onEdit={(updated) => handleEditNote(note._id, updated)}
              />
            ))}
          </ul>

          {isBoxOpen && (
            <NoteForm
              onSubmit={(note) => handleAddNote(note)}
              onClose={() => setIsBoxOpen(false)}
            />
          )}
        </div>
      ) : (
        <div className="px-4">
          <p className="text-white text-lg italic pb-1">No notes</p>

          {isBoxOpen && (
            <NoteForm
              onSubmit={(note) => handleAddNote(note)}
              onClose={() => setIsBoxOpen(false)}
            />
          )}
        </div>
      )}

      {!isBoxOpen && !loading && (
        <div
          onClick={() => setIsBoxOpen(true)}
          className="w-68 pl-2 py-1.5 mx-auto mt-5 flex items-center gap-2 hover:bg-[#5b97b5] rounded-lg cursor-pointer"
        >
          <span className="text-[20px]">
            <IoMdAdd className="text-[#012131]" />
          </span>
          <span className="font-medium text-[#012a3e]">Add a card</span>
        </div>
      )}
    </div>
  );
};

export default ListColumn;
