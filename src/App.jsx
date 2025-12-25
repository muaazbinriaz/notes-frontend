import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Nav from "./components/Nav";
import NewNotes from "./pages/NewNotes";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

const App = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/website/notes/getNotes`)
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <ToastContainer />
      <Nav />
      <Routes>
        <Route index element={<Signup />} /> {/* ✅ default page */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={<Home notes={notes} setNotes={setNotes} />}
        />
        <Route
          path="/NewNotes"
          element={<NewNotes notes={notes} setNotes={setNotes} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
