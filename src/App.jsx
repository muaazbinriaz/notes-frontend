import Home from "./pages/Home";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import NewNotes from "./pages/NewNotes";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Sign from "./pages/Sign";

const App = () => {
  const [notes, setNotes] = useState([]);
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/website/notes/getNotes`)
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err));
  }, []);

  const allowedUrls = ["", "NewNotes"];

  return (
    <>
      <ToastContainer />
      {allowedUrls.includes(path) && <Nav />}
      <Routes>
        <Route index element={<Home notes={notes} setNotes={setNotes} />} />
        <Route
          path="/NewNotes"
          element={<NewNotes notes={notes} setNotes={setNotes} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/Sign" element={<Sign />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;
