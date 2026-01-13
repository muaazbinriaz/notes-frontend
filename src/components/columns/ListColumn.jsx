import { useDrop } from "react-dnd";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useNotes } from "../../context/notesContext";
import NoteItem from "../notes/NoteItem";
import NoteForm from "../notes/NoteForm";

const ListColumn = ({ list }) => {
  const { notes, addNote, moveNote, editNote, deleteNote } = useNotes();
  const [isBoxOpen, setIsBoxOpen] = useState(false);

  const listNotes = notes.filter((n) => n.listId === list._id);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "Note",
    drop: (item) => moveNote(item._id, list._id),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  return (
    <div
      ref={drop}
      className={`bg-[#78afcb] w-72 pb-3 rounded-xl ${
        isOver ? "bg-blue-400" : ""
      }`}
    >
      <p className="p-3 pl-6 text-[17px] font-semibold text-[#012a3e]">
        {list.title}
      </p>
      {listNotes.length > 0 ? (
        <ul className="w-63 p-2 mx-auto flex flex-col gap-2">
          {listNotes.map((note) => (
            <NoteItem
              key={note._id}
              note={note}
              onDelete={deleteNote}
              onEdit={editNote}
            />
          ))}
        </ul>
      ) : (
        <p className="text-white px-4 text-lg pb-1 italic">No notes</p>
      )}
      {isBoxOpen ? (
        <NoteForm
          onSubmit={(note) => addNote({ ...note, listId: list._id })}
          onClose={() => setIsBoxOpen(false)}
        />
      ) : (
        <div
          onClick={() => setIsBoxOpen(true)}
          className="w-63 pl-2 py-1.5 mx-auto mt-5 flex items-center gap-2 hover:bg-[#5b97b5] rounded-lg cursor-pointer"
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
