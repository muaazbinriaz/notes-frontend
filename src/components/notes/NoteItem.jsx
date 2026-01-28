import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { MdSubject } from "react-icons/md";
import NoteForm from "./NoteForm";
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
      <div className="fixed bg-black/40 inset-0 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-[#1c1d1f] p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
          <NoteForm
            initialData={note}
            onSubmit={(data) => {
              onEdit(data);
              setEditing(false);
            }}
            onClose={() => setEditing(false)}
            onDelete={() => {
              setEditing(false);
              onDelete();
            }}
          />
        </div>
      </div>
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
          {note.body && (
            <div className="mt-2">
              <MdSubject
                className="text-gray-400 size-4"
                title="This card has a description."
              />
            </div>
          )}
        </div>
      </li>
    </div>
  );
};

export default NoteItem;
