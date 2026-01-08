import { useDrag } from "react-dnd";
import { MdDeleteOutline } from "react-icons/md";

const NoteItem = ({ note, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "Note",
    item: { _id: note._id },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <li
      ref={drag}
      className={`relative p-2 rounded border ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="font-medium">{note.title}</div>
      <div className="text-sm">{note.body}</div>
      <MdDeleteOutline
        className="text-red-500 hover:text-red-600 text-xl absolute right-2 top-5 cursor-pointer"
        onClick={() => onDelete(note._id)}
      />
    </li>
  );
};

export default NoteItem;
