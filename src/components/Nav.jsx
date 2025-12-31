import { useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    // if (typeof fetchNotes === "function") {
    //   fetchNotes();
    // }
    navigate("/");
  };

  return (
    <div className="bg-[#437993] text-white flex justify-between items-center px-10 py-3">
      <div>
        <h1 className="font-bold text-4xl leading-11">Notes App</h1>
        <p className="text-[17px]">Take Notes and never forget</p>
      </div>
      {token && (
        <button
          onClick={handleLogout}
          className="bg-blue-600 hover:bg-blue-500 transition duration-300 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Nav;
