import React from "react";
import { Outlet } from "react-router-dom";
import { useAuthstore } from "../store/Authstore";

const Dashlayout = () => {
  return (
    <div className="h-screen w-screen p-2 bg-black overflow-hidden">
      <Outlet />
    </div>
  );
};

export default Dashlayout;
