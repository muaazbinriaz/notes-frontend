import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Nav from "./components/Nav";
import NewNotes from "./pages/NewNotes";
import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/website/notes/getNotes")
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err));
  }, []);

  let url = window.location.href.split("/").pop();
  if (url.includes("?")) {
    url = url.split("?")[0];
  }

  const allowedUrls = ["", "NewNotes"];
  return (
    <>
      {allowedUrls.includes(url) && <Nav />}
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
