import Home from "./pages/Home";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import NewNotes from "./pages/NewNotes";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import NotFound from "./pages/NotFound";
import useAuth from "./context/useAuth";
import RequireAuth from "./components/RequireAuth";

const App = () => {
  const location = useLocation();
  const { auth } = useAuth();
  const path = location.pathname.split("/")[1];
  const allowedUrls = ["", "signup", "login", "home"];

  return (
    <>
      {allowedUrls.includes(path) && <Nav />}
      <Routes>
        <Route
          path="/"
          element={auth?.token ? <Navigate to="/home" /> : <Login />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/NewNotes"
          element={
            <RequireAuth>
              <NewNotes />
            </RequireAuth>
          }
        />

        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

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
    </>
  );
};

export default App;
