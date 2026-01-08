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
    <div className="w-63 -ml-2 wrap-break-word">
      <li
        ref={drag}
        className={`relative p-2 rounded-lg bg-white  ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <div className="max-w-53 w-full text-gray-900">{note.title}</div>
        <div className="max-w-53 w-full text-sm text-gray-800">{note.body}</div>
        <MdDeleteOutline
          className="text-red-500 hover:text-red-600 text-xl absolute right-2 top-5 cursor-pointer"
          onClick={() => onDelete(note._id)}
        />
      </li>
    </div>
  );
};

export default NoteItem;
