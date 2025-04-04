import React, { useState } from "react";
import Input from "../customs/Input";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

const Forgotpassword = () => {
  const navigate = useNavigate();
  const [userData, setuserData] = useState("");
  const [error, seterror] = useState(false);
  const Handleonchange = (e) => {
    const { value } = e.target;
    setuserData(value);
  };
  const Handlesubmit = (e) => {
    e.preventDefault();
    navigate("/auth/forgot-password/reset");
  };

  return (
    <div className={`w-[410px] h-max flex flex-col gap-5 -mt-[10%]`}>
      <div className="text-center font-tektur font-extrabold text-2xl">
        Reset your password
      </div>
      <div className="text-center font-semibold text-lg">
        Or return to{" "}
        <Link
          to={`/auth/sign-in/email`}
          className="text-blue-400 hover:underline"
        >
          {" "}
          Login
        </Link>
      </div>
      <form onSubmit={Handlesubmit} className="flex flex-col gap-4" action="">
        <Input
          name={"email"}
          type={`email`}
          label={`Email address`}
          placeholder={`Enter your verified email`}
          icon1={Mail}
          onchange={Handleonchange}
        />
        <div className="text-center text-red-500 -my-2">
          <span>{error && "Error sending password reset link."}</span>
        </div>

        <div className="flex justify-center items-center mt-3">
          <button
            type="submit"
            className="ml-2 px-4 py-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
          >
            Reset password
          </button>
        </div>
      </form>
    </div>
  );
};

export default Forgotpassword;
