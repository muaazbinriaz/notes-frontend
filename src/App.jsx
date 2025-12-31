import Home from "./pages/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import NewNotes from "./pages/NewNotes";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const App = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];

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

      {allowedUrls.includes(path) && <Nav />}
      <Routes>
        <Route index element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/NewNotes"
          element={
            <ProtectedRoute>
              <NewNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
