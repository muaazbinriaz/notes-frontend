import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthProvider.jsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { NotesProvider } from "./context/NotesContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <NotesProvider>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </NotesProvider>
    </AuthProvider>
  </BrowserRouter>
);
