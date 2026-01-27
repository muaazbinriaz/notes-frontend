import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { TiDelete } from "react-icons/ti";
import NoteForm from "./NoteForm";
import PromptClamp from "../PromptClamp";
import { useMoveNoteMutation } from "../../features/lists/noteApi";

const NoteItem = ({ note, index, onDelete, onEdit }) => {
  const [moveNote] = useMoveNoteMutation();
  const ref = useRef(null);
  const [editing, setEditing] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "Note",
    item: { noteId: note._id, listId: note.listId, position: index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const [, drop] = useDrop({
    accept: "Note",
    hover(item) {
      if (!ref.current) return;
      const dragIndex = item.position;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      item.position = hoverIndex;
    },
    drop(item) {
      moveNote({
        noteId: item.noteId,
        listId: note.listId,
        position: item.position,
      });
    },
  });

  drag(drop(ref));

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
    <div className="w-68">
      <li
        ref={ref}
        onClick={() => setEditing(true)}
        className={`relative p-2 rounded-lg bg-[#242528] cursor-pointer ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <div className="wrap-break-word whitespace-pre-wrap">
          {note.picture && (
            <img
              src={note.picture}
              alt="note"
              className="w-full rounded-lg mb-2"
            />
          )}

          <div className="text-gray-300 font-medium">{note.title}</div>
          <div className="text-gray-400">
            <PromptClamp text={note.body} />
          </div>
          <TiDelete
            className="text-blue-600 size-6 text-xl absolute right-2 bottom-5 hover:text-red-500 duration-200"
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
