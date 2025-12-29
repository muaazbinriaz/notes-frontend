import Home from "./pages/Home";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import NewNotes from "./pages/NewNotes";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

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
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {allowedUrls.includes(path) && <Nav fetchNotes={fetchNotes} />}
      <Routes>
        <Route index element={<Login fetchNotes={fetchNotes} />} />
        <Route path="/signup" element={<Signup fetchNotes={fetchNotes} />} />

        <Route
          path="/NewNotes"
          element={
            <ProtectedRoute>
              <NewNotes notes={notes} setNotes={setNotes} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home notes={notes} loading={loading} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
