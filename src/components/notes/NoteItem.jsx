import { useState } from "react";
import { useDrag } from "react-dnd";
import { TiDelete } from "react-icons/ti";
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
    <div className="w-68 ">
      <li
        ref={drag}
        onClick={() => setEditing(true)}
        className={`relative p-2  rounded-lg bg-white cursor-pointer ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <div className="wrap-break-word whitespace-pre-wrap ">
          <div className="text-gray-900 font-medium">{note.title}</div>
          <PromptClamp text={note.body} />
          <TiDelete
            className="text-blue-600 size-6 text-xl absolute right-2 top-5"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note._id);
            }}
          />
        </div>
      </li>
    </div>
  );
};

export default NoteItem;
