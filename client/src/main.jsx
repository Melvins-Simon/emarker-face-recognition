import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Globalcontext from "./contexts/Usecontext.jsx";

createRoot(document.getElementById("root")).render(
  <Globalcontext>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Globalcontext>
);
