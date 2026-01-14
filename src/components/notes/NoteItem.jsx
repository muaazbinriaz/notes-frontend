import { useState } from "react";
import { useDrag } from "react-dnd";
import { MdDeleteOutline } from "react-icons/md";
import NoteForm from "./NoteForm";
import PromptClamp from "../PromptClamp";

const NoteItem = ({ note, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "Note",
    item: { _id: note._id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  if (editing) {
    return (
      <NoteForm
        initialData={note}
        onSubmit={(data) => onEdit(data)}
        onClose={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="w-63 -ml-2 wrap-break-word">
      <li
        ref={drag}
        onClick={() => setEditing(true)}
        className={`relative p-2 rounded-lg bg-white cursor-pointer ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <div className="text-gray-900">{note.title}</div>
        <PromptClamp text={note.body} />
        <MdDeleteOutline
          className="text-red-500 text-xl absolute right-2 top-5"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note._id);
          }}
        />
      </li>
    </div>
  );
};

export default NoteItem;
