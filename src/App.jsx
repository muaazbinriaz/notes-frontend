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
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/website/notes/getNotes`)
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err));
  }, []);

  const allowedUrls = ["", "NewNotes", "signup", "login", "home"];

  return (
    <>
      <ToastContainer />
      {allowedUrls.includes(path) && <Nav />}
      <Routes>
        <Route index element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/NewNotes"
          element={<NewNotes notes={notes} setNotes={setNotes} />}
        />
        <Route
          path="/home"
          element={<Home notes={notes} setNotes={setNotes} />}
        />
        <Route path="*" element={<Navigate to="/signup" />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
