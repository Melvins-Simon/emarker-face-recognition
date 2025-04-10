import React from "react";

const Admindash = () => {
  const user = localStorage.getItem("user");
  return <div className="bg-green-500">{`Welcome ${user}`}</div>;
};

export default Admindash;
