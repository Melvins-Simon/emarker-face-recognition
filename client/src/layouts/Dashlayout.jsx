import React from "react";
import { Outlet } from "react-router-dom";

const Dashlayout = () => {
  return (
    <div>
      hello
      {<Outlet />}
    </div>
  );
};

export default Dashlayout;
