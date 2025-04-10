import { createContext, useState } from "react";

export const Globalstate = createContext(null);

function Globalcontext({ children }) {
  const [user, setuser] = useState(() => {
    const user = localStorage.getItem("user");
    if (user) return user;
    else {
      localStorage.setItem("user", "User");
      return "User";
    }
  });
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
    <Globalstate.Provider value={{ role, setRole, cod, setcod, user, setuser }}>
      {children}
    </Globalstate.Provider>
  );
}

export default Globalcontext;
