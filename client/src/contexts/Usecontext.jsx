import { createContext, useState } from "react";

export const Globalstate = createContext(null);

function GlobalContext({ children }) {
  const [role, setRole] = useState(() => {
    const role = localStorage.getItem("role");
    if (role) return role;
    else {
      localStorage.setItem("role", "student");
      return "student";
    }
  });
  const [cod, setcod] = useState("");
  return (
    <Globalstate.Provider value={{ role, setRole, cod, setcod }}>
      {children}
    </Globalstate.Provider>
  );
}

export default GlobalContext;
