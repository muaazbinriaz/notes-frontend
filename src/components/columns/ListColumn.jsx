import { useDrag, useDrop } from "react-dnd";
import { useRef, useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";
import NoteItem from "../notes/NoteItem";
import NoteForm from "../notes/NoteForm";
import Swal from "sweetalert2";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  useAddNoteMutation,
  useDeleteNoteMutation,
  useEditNoteMutation,
  useGetNotesQuery,
  useMoveNoteMutation,
  useUploadImageMutation,
} from "../../features/lists/noteApi";
import { useDeleteListMutation } from "../../features/lists/listApi";
import RoundedLoader from "../RoundedLoader";

const ListColumn = ({ list, index, moveList }) => {
  const { data: notes } = useGetNotesQuery(list._id);
  const [addNote] = useAddNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();
  const [editNote] = useEditNoteMutation();
  const [moveNote] = useMoveNoteMutation();
  const [deleteList] = useDeleteListMutation();
  const [uploadImage] = useUploadImageMutation();
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [sortBy, setSortBy] = useState("sort by");
  const [selectedNote, setSelectedNote] = useState(null);

  const listNotesRaw = Array.isArray(notes)
    ? notes.filter((note) => note.listId === list._id)
    : [];
  const ref = useRef(null);
  const panelRef = useRef(null);
  const filteredNotes = Array.isArray(listNotesRaw)
    ? listNotesRaw.filter((note) => {
        const title = note?.title || "";
        const body = note?.body || "";
        return (
          title.toLowerCase().includes(searchFilter.toLowerCase()) ||
          body.toLowerCase().includes(searchFilter.toLowerCase())
        );
      })
    : [];

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === "alphabet") {
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    }
    if (sortBy === "lastEdited") {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
    if (sortBy === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === "sort by") {
      return a.position - b.position;
    }

    return a.position - b.position;
  });

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: "LIST",
      item: { id: list._id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index, list._id],
  );

  const [, dropRef] = useDrop(
    () => ({
      accept: "LIST",
      hover: (item, monitor) => {
        if (!ref.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;
        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const hoverMiddleX =
          (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientX = clientOffset.x - hoverBoundingRect.left;
        if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
          return;
        }
        if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
          return;
        }
        moveList(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    }),
    [index, moveList],
  );

  const [{ isOver }, noteDropRef] = useDrop(
    () => ({
      accept: "Note",
      drop: async (item) => {
        try {
          await moveNote({
            noteId: item.noteId,
            listId: list._id,
            position: item.position,
          }).unwrap();
        } catch (err) {
          console.error("Failed to move note:", err);
        }
      },
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [list._id, moveNote],
  );

  const handleAddNote = async (note) => {
    setLoading(true);
    try {
      const newNote = await addNote({
        title: note.title,
        listId: list._id,
      }).unwrap();

      if (note.imageFile) {
        await uploadImage({
          noteId: newNote.data._id,
          imageFile: note.imageFile,
        }).unwrap();
      }
      setIsBoxOpen(false);
      setSelectedNote(newNote.data);
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
      let pictureUrl = updated.picture;
      if (updated.imageFile) {
        const res = await uploadImage({
          noteId: id,
          imageFile: updated.imageFile,
        }).unwrap();
        pictureUrl = res.data.picture;
      }
      const updatePayload = {};
      if (updated.title !== undefined) updatePayload.title = updated.title;
      if (updated.body !== undefined) updatePayload.body = updated.body;
      if (pictureUrl !== undefined) updatePayload.picture = pictureUrl;

      await editNote({
        id,
        updateNote: updatePayload,
      }).unwrap();
      toast.success("Note updated successfully!");
    } catch (err) {
      console.error("Edit error:", err);
      toast.error("Failed to update note.");
    } finally {
      setLoading(false);
    }
  };

  const handleEllipse = () => {
    setIsPanelOpen((prev) => !prev);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".ellipse-button")) {
        return;
      }
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsPanelOpen(false);
      }
    };
    if (isPanelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPanelOpen]);

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
        toast.error("Failed to delete list");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      ref={(node) => {
        ref.current = node;
        dragRef(dropRef(noteDropRef(node)));
      }}
      className={`bg-[#0E1011] max-w-72 w-full shrink-0 pb-3 rounded-xl transition-all duration-200 ${
        isOver ? "bg-[#262728]" : ""
      } ${isDragging ? "opacity-50 cursor-grabbing" : "opacity-100 cursor-grab"}`}
    >
      <div className="p-4 flex justify-between ">
        <p className="pl-2 text-[17px] wrap-break-word max-w-52 w-full font-semibold text-gray-400">
          {list.title}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleEllipse}
            className="cursor-pointer ellipse-button"
          >
            <HiEllipsisHorizontal className="size-6 text-white" />
          </button>
          <button onClick={handleDeleteList} className="cursor-pointer">
            <RiDeleteBin6Line className="size-5 text-white hover:text-red-600 duration-200" />
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <RoundedLoader />
        </div>
      ) : (
        <div className="overflow-scroll max-h-[calc(100vh-260px)] scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {isPanelOpen && (
            <div ref={panelRef} className="px-2 pb-3 sticky top-0 z-10">
              <div className="bg-[#242528] rounded-lg p-3 flex flex-col gap-3">
                <div className="flex items-center gap-3"></div>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Filter by"
                    className="rounded-lg bg-gray-700 p-2 border border-gray-300 text-gray-300 focus:outline-none focus:ring-2 placeholder-gray-400"
                    onChange={(e) => setSearchFilter(e.target.value)}
                    value={searchFilter}
                  />
                  <select
                    className="px-3 py-2 bg-gray-700 rounded-lg cursor-pointer border border-gray-300 text-gray-300 appearance-none focus:outline-none focus:ring-1 transition duration-300"
                    onChange={(e) => setSortBy(e.target.value)}
                    value={sortBy}
                  >
                    <option value="sort by">Sort By</option>
                    <option value="recent">Recently Created</option>
                    <option value="alphabet">Alphabet</option>
                    <option value="lastEdited">Last Edited</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {sortedNotes.length > 0 ? (
            <ul className="max-w-68 w-full mx-auto flex flex-col gap-2">
              {sortedNotes.map((note, noteIndex) => (
                <NoteItem
                  key={note._id}
                  note={note}
                  index={noteIndex}
                  onDelete={() => handleDeleteNote(note._id)}
                  onEdit={(updated) => handleEditNote(note._id, updated)}
                />
              ))}
            </ul>
          ) : listNotesRaw.length > 0 ? (
            <div className="px-4">
              <p className="text-white text-lg italic pb-1">
                No notes match your filter
              </p>
            </div>
          ) : (
            <div className="px-4">
              <p className="text-white text-lg italic pb-1">No notes</p>
            </div>
          )}

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
          className="w-68 pl-2 py-1.5 mx-auto mt-5 text-gray-400 flex items-center gap-2 hover:bg-gray-700 hover:text-gray-300 rounded-lg cursor-pointer duration-300"
        >
          <span className="text-[20px]">
            <IoMdAdd className="" />
          </span>
          <span className="font-medium ">Add a card</span>
        </div>
      )}
    </div>
  );
};

export default ListColumn;
