import React, { useState } from "react";
import Input from "../customs/Input";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const Reset = () => {
  const [userData, setuserData] = useState("");
  const [error, seterror] = useState(false);
  const Handleonchange = (e) => {
    const { value } = e.target;
    setuserData(value);
  };
  const Handlesubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className={`w-[410px] h-max flex flex-col gap-5 -mt-[10%]`}>
      <div className="text-center font-tektur font-extrabold text-2xl">
        Check your email
      </div>
      <div className="text-center text-lg">
        We sent an email to{" "}
        <span className="font-semibold">melvinssimon452@gmail.com</span> which
        contains a link to reset your password. <br />
        <Link
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
