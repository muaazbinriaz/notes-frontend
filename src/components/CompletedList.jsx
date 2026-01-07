import { useDrop } from "react-dnd";
import { useNotes } from "../context/NotesContext";
import NoteItem from "./NoteItem";

const CompletedList = () => {
  const { completed, moveToCompleted } = useNotes();
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "Note",
    drop: (item) => {
      moveToCompleted(item);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));
  return (
    <div
      ref={drop}
      className={`bg-[#60cdf5] pb-5 w-70 rounded-xl ${
        isOver ? "bg-blue-400" : ""
      }`}
    >
      <p className="p-3">Completed</p>
      <div>
        <ul className="bg-white w-63 p-2 rounded-lg mx-auto flex flex-col gap-2">
          {completed.map((note) => (
            <NoteItem key={note._id} note={note} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CompletedList;
