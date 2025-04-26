import React from "react";
import { Outlet } from "react-router-dom";
import { useAuthstore } from "../store/Authstore";

const Dashlayout = () => {
  const { userID } = useAuthstore();
  console.log(userID);

  return (
    <div className="h-screen w-screen p-2 bg-black">
      <Outlet />
    </div>
  );
};

export default Dashlayout;
