import React from "react";
import { Link } from "react-router-dom";

const Reset = () => {
  return (
    <div className={`w-[410px] h-max flex flex-col gap-5 -mt-[10%]`}>
      <div className="text-center font-tektur font-extrabold text-2xl">
        Check your email
      </div>
      <div className="text-center text-lg">
        We sent an email to{" "}
        <span className="font-semibold">
          {localStorage.getItem("em") || "your email"}
        </span>{" "}
        which contains a link to reset your password. <br />
        <Link
          onClick={() => localStorage.removeItem("em")}
          to={`/auth/sign-in/email`}
          className="text-blue-400 hover:underline mt-4"
        >
          {" "}
          Login
        </Link>{" "}
        <br />
        after your reset is successful.
      </div>
    </div>
  );
};

export default Reset;
