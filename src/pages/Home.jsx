import { Link, useNavigate } from "react-router-dom";
import PromptClamp from "../components/PromptClamp";
import { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import RoundedLoader from "../components/RoundedLoader";
import { getAuthHeader } from "../utils/helper";

const Home = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [sortBy, setSortBy] = useState("sort by");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalNotes, setTotalNotes] = useState({
    totalNotes: 0,
    totalPages: 0,
    currentPage: 1,
  });

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/website/notes/getNotes?page=${page}&limit=${limit}`,
          getAuthHeader()
        );
        setNotes(res.data.data);
        setTotalNotes({
          totalNotes: res.data.totalNotes,
          totalPages: Math.ceil(res.data.totalNotes / limit),
          currentPage: page,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [page, limit]);

  const filteredNotes = Array.isArray(notes)
    ? notes.filter((note) => {
        const title = note?.title || "";
        const body = note?.body || "";
        return (
          title.toLowerCase().includes(searchFilter.toLowerCase()) ||
          body.toLowerCase().includes(searchFilter.toLowerCase())
        );
      })
    : [];

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === "alphabet") {
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    }
    if (sortBy === "lastEdited") {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (loading) {
    return <RoundedLoader />;
  }

  if (!Array.isArray(notes) || notes.length === 0) {
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
      <div className="bg-[#F7F7F7] text-[18px] flex justify-center py-4">
        <div className="flex justify-center max-w-140 w-full gap-12">
          <input
            type="text"
            placeholder="Filter by"
            className="rounded-lg max-w-50 w-full bg-[#fafafa] p-2 border border-[#437993] text-[#1f5672] focus:outline-none focus:ring-2 focus:ring-[#437993] placeholder-gray-400"
            onChange={(e) => setSearchFilter(e.target.value)}
            value={searchFilter}
          />
          <div className="relative w-full max-w-50 ">
            <select
              className="px-3 py-2 w-full bg-[#fafafa] rounded-lg cursor-pointer border border-[#437993] text-[#1f5672] appearance-none focus:outline-none focus:ring-1 focus:ring-[#437993] transition duration-300"
              onChange={(e) => setSortBy(e.target.value)}
              value={sortBy}
            >
              <option value="sort by">Sort By</option>
              <option value="recent">Recently Created</option>
              <option value="alphabet">Alphabet</option>
              <option value="lastEdited">Last Edited</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#1f5672]  transition duration-300" />
          </div>
        </div>
      </div>

      <div className="max-w-175 py-3 px-3 mx-auto mt-4 flex flex-col gap-2">
        {sortedNotes.map((note) => (
          <div
            key={note._id}
            className="p-3 flex flex-col gap-2.5 bg-[#F7F7F7] text-[#160101fb] cursor-pointer wrap-break-word"
            onClick={() => navigate(`/NewNotes?id=${note._id}`)}
          >
            <h3 className="font-medium">{note.title}</h3>
            <PromptClamp text={note.body} />
            <span className="text-right text-[#437993]">
              Last Edited :{" "}
              {(() => {
                const timeDiff = new Date() - new Date(note.updatedAt);
                const seconds = Math.floor(timeDiff / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);
                const days = Math.floor(hours / 24);
                if (seconds < 60) return `${seconds} seconds ago`;
                if (minutes < 60) return `${minutes} minutes ago`;
                if (hours < 24) return `${hours} hours ago`;
                return `${days} days ago`;
              })()}
            </span>
          </div>
        ))}
      </div>

      {totalNotes.totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-5">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-[#437993] text-white rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalNotes.totalPages}
          </span>
          <button
            disabled={page === totalNotes.totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-[#437993] text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <div className="fixed bottom-0 m-5 right-0">
        <Link to={"/NewNotes"}>
          <button className="border text-lg cursor-pointer rounded-lg bg-[#437993] p-5 text-white hover:bg-[#055f8c] duration-500">
            Create New Note
          </button>
        </Link>
      </div>
    </>
  );
};

export default Home;
