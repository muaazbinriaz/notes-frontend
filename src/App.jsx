import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
// updated
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

const App = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <>
      <Nav />
      <Routes>
        <Route
          path="/"
          element={<Navigate to={auth?.token ? "/boards" : "/login"} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
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
      <ToastContainer position="top-right" autoClose={500} />
    </>
  );
};

export default App;
