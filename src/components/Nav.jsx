import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../features/lists/authApi";
import { logout as logoutAction } from "../features/auth/authSlice";
import { listApi } from "../features/lists/listApi";
import { noteApi } from "../features/lists/noteApi";

const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  const auth = useSelector((state) => state.auth);
  const dropDown = useRef(null);
  const [open, setOpen] = useState(false);

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
    <div className="bg-[#437993] text-white flex justify-between items-center px-10 py-3">
      <div>
        <h1 className="font-bold text-4xl leading-11">Notes App</h1>
        <p className="text-[17px]">Take Notes and never forget</p>
      </div>
      {auth?.token && (
        <div>
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 cursor-pointer rounded-full bg-[#78AFCB] hover:bg-[#5faacf] duration-200 text-white font-bold flex items-center justify-center"
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
                  className="mt-2 cursor-pointer bg-[#407b98] hover:bg-[#4f8aa7] transition duration-300 text-white px-3 py-1 rounded-md"
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
