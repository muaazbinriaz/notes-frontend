import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../features/lists/authApi";
import { logout as logoutAction } from "../features/auth/authSlice";
import { boardApi, useGetBoardByIdQuery } from "../features/lists/boardApi";
import { listApi } from "../features/lists/listApi";
import { noteApi } from "../features/lists/noteApi";
import SharedBoard from "./SharedBoard";
import { IoIosClose } from "react-icons/io";

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const match = useMatch("/home/:boardId");
  const boardId = match?.params?.boardId;
  const isHomePage = !!boardId;
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  const auth = useSelector((state) => state.auth);
  const dropDown = useRef(null);
  const [open, setOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { data: boardData } = useGetBoardByIdQuery(boardId, {
    skip: !isHomePage || !boardId,
  });
  const board = boardData?.data;
  const firstLetter = auth?.user?.name
    ? auth.user.name.charAt(0).toUpperCase()
    : "?";

  const closeDropdown = (e) => {
    if (dropDown.current && !dropDown.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout error:", err);
    }

    dispatch(logoutAction());
    localStorage.removeItem("auth");
    dispatch(boardApi.util.resetApiState());
    dispatch(listApi.util.resetApiState());
    dispatch(noteApi.util.resetApiState());
    setOpen(false);
    navigate("/");
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  return (
    <div
      className="bg-gray-500/30  shadow-xl border-white/20
 text-white flex justify-between items-center px-10 py-3 "
    >
      <div>
        <h1 className="font-bold text-4xl leading-11">Notes App</h1>
        <p className="text-[17px]">Take Notes and never forget</p>
      </div>
      {auth?.token && (
        <div className="flex gap-3">
          {isHomePage && (
            <button
              className="bg-[#DCDFE4] text-gray-700 duration-300 hover:bg-[#cbcdd0] cursor-pointer px-4 rounded-md"
              onClick={() => setShareOpen(true)}
            >
              Share
            </button>
          )}
          {isHomePage && shareOpen && (
            <div className="fixed bg-black/40 inset-0 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-gray-300 backdrop-blur-lg rounded-xl borde p-6 shadow-lg w-100 relative text-gray-950">
                <button
                  onClick={() => setShareOpen(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <IoIosClose className="text-red-500 size-10 hover:text-red-600 duration-300" />
                </button>
                <div className="p-4 border-gray-200 ">
                  <SharedBoard boardId={boardId} />
                  {board && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">
                        Board Collaborators
                      </h3>
                      <ul className="list-disc list-inside">
                        {board?.ownerId && (
                          <li>
                            {board.ownerId.name} ({board.ownerId.email}) - owner
                          </li>
                        )}
                        {board?.members?.length > 0 ? (
                          board.members.map((m) => (
                            <li key={m._id}>
                              {m.name} ({m.email})
                            </li>
                          ))
                        ) : (
                          <li className="">No members yet</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 cursor-pointer rounded-full bg-[#4f4f4f] hover:bg-[#414142] duration-200 text-white font-bold flex items-center justify-center"
          >
            {firstLetter}
          </button>

          {open && (
            <div
              ref={dropDown}
              className="absolute right-0 mt-2 w-65 bg-white border border-gray-200 rounded-md shadow-md z-10"
            >
              <div className="p-4">
                <p className="text-gray-700">{auth?.user?.name}</p>
                <p className="text-gray-500">{auth?.user?.email}</p>
                <button
                  onClick={handleLogout}
                  className="mt-2 cursor-pointer bg-[#565758] hover:bg-[#333333] transition duration-300 text-white px-3 py-1 rounded-md"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Nav;
