import React from "react";
import { Outlet } from "react-router-dom";

const Infolayout = () => {
  return (
    <div className=" h-screen w-screen flex justify-center items-center bg-gradient-to-r from-cyan-200 via-indigo-200 to-blue-200">
      <Outlet />
    </div>
  );
};

export default Infolayout;
