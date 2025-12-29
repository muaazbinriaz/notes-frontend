import Home from "./pages/Home";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import NewNotes from "./pages/NewNotes";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  const fetchNotes = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNotes([]);
      return;
    }
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/website/notes/getNotes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const allowedUrls = ["", "NewNotes", "signup", "login", "home"];

  return (
    <>
      <ToastContainer />
      {allowedUrls.includes(path) && <Nav fetchNotes={fetchNotes} />}
      <Routes>
        <Route index element={<Signup fetchNotes={fetchNotes} />} />
        <Route path="/signup" element={<Signup fetchNotes={fetchNotes} />} />
        <Route path="/login" element={<Login fetchNotes={fetchNotes} />} />
        <Route
          path="/NewNotes"
          element={<NewNotes notes={notes} setNotes={setNotes} />}
        />
        <Route
          path="/home"
          element={<Home notes={notes} loading={loading} />}
        />
        <Route path="*" element={<Navigate to="/signup" />} />
      </Routes>
    </>
  );
};

export default App;
