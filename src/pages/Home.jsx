import { Link, useNavigate } from "react-router-dom";
import PromptClamp from "../components/PromptClamp";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

const Home = ({ notes, loading }) => {
  const navigate = useNavigate();
  const [searchFilter, setSearchFilter] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  if (loading) {
    return (
      <div className="flex max-w-175 w-full mx-auto mt-28 p-5">
        <p className="bg-[#fafafa] py-4.5 text-center text-[21px] font-medium text-[#1f5672] rounded max-w-175 w-full">
          Loading notes...
        </p>
      </div>
    );
  }

  const filteredNotes = notes.filter((note) => {
    return (
      note.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      note.body.toLowerCase().includes(searchFilter.toLowerCase())
    );
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === "alphabet") {
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    }
    if (sortBy === "lastEdited") {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (notes.length === 0) {
    return (
      <>
        <div className="flex max-w-175 w-full mx-auto mt-28 p-5">
          <p className="bg-[#fafafa] py-4.5 text-center text-[21px] font-medium text-[#1f5672] rounded max-w-175 w-full">
            No Notes here! Create your First Note ✨
          </p>
        </div>
        <div className="fixed bottom-0 m-5 right-0">
          <Link to={"/NewNotes"}>
            <button className="border text-lg cursor-pointer rounded-lg bg-[#437993] p-5 text-white hover:bg-black duration-500">
              Create New Note
            </button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="bg-[#F7F7F7] text-[18px] flex justify-center py-4">
        <div className="flex justify-center max-w-140 w-full gap-12">
          <input
            type="text"
            placeholder="Filter by"
            className="rounded-lg max-w-50 w-full bg-white p-2"
            onChange={(e) => setSearchFilter(e.target.value)}
            value={searchFilter}
          />
          <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
            <option value="recent">Recently Created</option>
            <option value="alphabet">Alphabet</option>
            <option value="lastEdited">Last Edited</option>
          </select>
        </div>
      </div>

      <div className="max-w-175 py-3 px-3 mx-auto mt-4 flex flex-col gap-2">
        {sortedNotes.map((note) => (
          <div
            key={note._id}
            className="p-3 flex flex-col gap-2.5 bg-[#F7F7F7] cursor-pointer wrap-break-word"
            onClick={() => navigate(`/NewNotes?id=${note._id}`)}
          >
            <h3 className="font-medium">{note.title}</h3>
            <PromptClamp text={note.body} />
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 m-5 right-0">
        <Link to={"/NewNotes"}>
          <button className="border text-lg cursor-pointer rounded-lg bg-[#437993] p-5 text-white hover:bg-black duration-500">
            Create New Note
          </button>
        </Link>
      </div>
    </>
  );
};

export default Home;
