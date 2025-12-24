import Home from "./pages/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Nav from "./components/Nav";
import NewNotes from "./pages/NewNotes";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";

const App = () => {
  const [notes, setNotes] = useState([]);
  const location = useLocation();
  const path = location.pathname.split("/")[1]; // '' or 'NewNotes'

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;