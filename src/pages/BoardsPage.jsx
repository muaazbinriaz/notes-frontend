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
          placeholder="New board title"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#437993]"
        />
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-[#658fa4] cursor-pointer text-white rounded-md hover:bg-[#75a1b8] duration-300"
          disabled={!title.trim()}
        >
          Create Board
        </button>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 my-6">My Boards</h1>

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
    </div>
  );
};

export default BoardsPage;
