import React from "react";
import { Outlet } from "react-router-dom";
import { useAuthstore } from "../store/Authstore";

const Dashlayout = () => {
  const { userID } = useAuthstore();
  console.log(userID);

  return (
    <div className="h-screen w-screen bg-cyan-600">
      hello
      <Outlet />
    </div>
  );
};

export default Dashlayout;
