import { useState } from "react";
import {
  useCreateBoardMutation,
  useGetBoardsQuery,
} from "../features/lists/boardApi";
import RoundedLoader from "../components/RoundedLoader";

const BoardsPage = ({ onSelectBoard }) => {
  const { data: boards, isLoading, error } = useGetBoardsQuery();
  const [createBoard] = useCreateBoardMutation();
  const [title, setTitle] = useState("");
  if (isLoading) return <RoundedLoader />;
  if (error) return <p>Failed to load boards</p>;

  const handleCreate = async () => {
    if (!title.trim()) return;
    await createBoard({ title });
    setTitle("");
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Boards</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl mb-6">
        {boards?.data?.map((board) => (
          <li
            key={board._id}
            onClick={() => onSelectBoard(board._id)}
            className="cursor-pointer p-6 bg-white rounded-lg shadow hover:shadow-md hover:bg-blue-50 transition"
          >
            <span className="text-lg font-semibold text-gray-700">
              {board.title}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex gap-2 w-full max-w-md">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New board title"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          disabled={!title.trim()}
        >
          Create Board
        </button>
      </div>
    </div>
  );
};

export default BoardsPage;
