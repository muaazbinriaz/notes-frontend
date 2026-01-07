import { useDrag } from "react-dnd";

const NoteItem = ({ note }) => {
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
      className={`p-2 rounded border ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="font-medium">{note.title}</div>
      <div className="text-sm">{note.body}</div>
    </li>
  );
};

export default NoteItem;
