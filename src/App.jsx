import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/RequireAuth";
import BoardsPage from "./pages/BoardsPage";
import RequireNoAuth from "./components/RequireNoAuth";
import { useEffect } from "react";
import socket from "./socket/socket";

const App = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Trying to connect socket");
    socket.connect();
    return () => {
      console.log("Disconnecting socket");
      socket.disconnect();
    };
  }, []);
  return (
    <>
      <div className="bg-[linear-gradient(90deg,rgba(57,35,170,1)_0%,rgba(110,49,165,1)_50%,rgba(192,67,159,1)_100%)] min-h-screen">
        <Nav />
        <Routes>
          <Route
            path="/"
            element={<Navigate to={auth?.token ? "/boards" : "/login"} />}
          />
          <Route
            path="/login"
            element={
              <RequireNoAuth>
                <Login />
              </RequireNoAuth>
            }
          />
          <Route
            path="/signup"
            element={
              <RequireNoAuth>
                <Signup />
              </RequireNoAuth>
            }
          />

          <Route path="/home" element={<Navigate to="/boards" />} />
          <Route
            path="/boards"
            element={
              <RequireAuth>
                <BoardsPage onSelectBoard={(id) => navigate(`/home/${id}`)} />
              </RequireAuth>
            }
          />
          <Route
            path="/home/:boardId"
            element={
              <RequireAuth>
                <DndProvider backend={HTML5Backend}>
                  <Home />
                </DndProvider>
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={1000} />
      </div>
    </>
  );
};

export default App;
