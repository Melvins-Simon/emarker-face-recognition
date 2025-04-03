import { createContext, useState } from "react";

export const Globalstate = createContext(null);

function Globalcontext({ children }) {
  const [role, setRole] = useState(() => {
    const role = localStorage.getItem("role");
    if (role) return role;
    else {
      localStorage.setItem("role", "student");
      return "student";
    }
  });
  return (
    <Globalstate.Provider value={{ role, setRole }}>
      {children}
    </Globalstate.Provider>
  );
}

export default Globalcontext;
