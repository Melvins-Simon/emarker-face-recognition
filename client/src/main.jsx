import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Globalcontext from "./contexts/Usecontext.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <Globalcontext>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </Globalcontext>
);
