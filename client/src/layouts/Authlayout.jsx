import React from "react";
import { Outlet } from "react-router-dom";
import { Logo } from "../components";
const Authlayout = () => {
  return (
    <div className="h-screen w-screen relative">
      <div className="absolute inset-40 bg-indigo-600/70 blur-[20rem]" />
      <div className="w-[60%] h-full m-auto relative flex justify-center items-center">
        <div className="absolute top-[5%] left-0">
          <Logo />
        </div>
        {<Outlet />}
      </div>
    </div>
  );
};

export default Authlayout;
