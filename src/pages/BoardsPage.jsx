import { useState } from "react";
import {
  useCreateBoardMutation,
  useGetBoardsQuery,
} from "../features/lists/boardApi";
import RoundedLoader from "../components/RoundedLoader";
import { toast } from "react-toastify";

const BoardsPage = ({ onSelectBoard }) => {
  const { data: boards, isLoading, error, refetch } = useGetBoardsQuery();
  const [createBoard, { isLoading: isCreating }] = useCreateBoardMutation();
  const [title, setTitle] = useState("");
  if (isLoading) return <RoundedLoader />;
  if (error) return <p>Failed to load boards</p>;
  const titleLimit = 50;

  const handleCreate = async () => {
    if (!title.trim()) return;
    await createBoard({ title });
    setTitle("");
    await refetch();
    toast.success("New Board Created Successfully!");
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      {isCreating && <RoundedLoader />}
      <div className="flex gap-2 w-full max-w-md">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={titleLimit}
          placeholder="New board title"
          className="flex-1 px-3 py-2 border text-gray-100 border-gray-300 rounded-md focus:outline-none"
        />
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-[#39393a] cursor-pointer text-white rounded-md hover:bg-[#333334] duration-300"
          disabled={!title.trim()}
        >
          Create Board
        </button>
      </div>
      {boards?.data?.length > 0 ? (
        <h1 className="text-3xl font-bold text-gray-100 my-6">My Boards</h1>
      ) : (
        <h1 className="text-3xl font-bold text-gray-100 my-6">
          Create your first board
        </h1>
      )}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 wrap-break-word gap-4 w-full max-w-4xl mb-6">
        {boards?.data?.map((board) => (
          <li
            key={board._id}
            onClick={() => onSelectBoard(board._id)}
            className="cursor-pointer p-6 px-2 bg-gray-300 rounded-lg shadow-xl hover:shadow-md hover:bg-gray-200 transition"
          >
            <span className="text-lg font-semibold text-gray-700">
              {board.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardsPage;
