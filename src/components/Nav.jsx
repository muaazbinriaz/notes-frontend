import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import useAuth from "../context/useAuth";

const Nav = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const dropDown = useRef(null);
  const [open, setOpen] = useState(false);

  const firstLetter = auth?.user?.name
    ? auth?.user.name.charAt(0).toUpperCase()
    : "?";

  const closeDropdown = (e) => {
    if (dropDown.current && !dropDown.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
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
            className="w-10 h-10 rounded-full bg-[#78AFCB] text-white font-bold flex items-center justify-center"
          >
            {firstLetter}
          </button>
          {open && (
            <div
              ref={dropDown}
              className="absolute right-0 mt-2 w-65 bg-white border border-gray-200 rounded-md shadow-md"
            >
              <div className="p-4">
                <p className="text-gray-700">{auth?.user?.name}</p>
                <p className="text-gray-500">{auth?.user?.email}</p>
                <button
                  onClick={handleLogout}
                  className="mt-2 bg-[#407b98] hover:bg-[#4f8aa7] transition duration-300 text-white px-3 py-1 rounded-md"
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
