import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MailIcon } from "lucide-react";
import { Globalstate } from "../../contexts/Usecontext";
import { Google } from "../../assets";
const Signin = () => {
  const { role, setRole } = useContext(Globalstate);
  const Handerole = (role) => {
    setRole(role);
    localStorage.setItem("role", role);
  };
  return (
    <div className={` w-[410px] h-max flex flex-col gap-5 -mt-[10%]`}>
      <div className="text-center font-tektur font-extrabold text-2xl">
        Log into emarker
      </div>
      <div className="text-lg font-semibold text-center">
        New to emarker?{" "}
        <Link to={"/auth/sign-up"} className="text-blue-400 hover:underline">
          Sign up for free
        </Link>
      </div>
      <div className="flex flex-col gap-5 w-[80%] mx-auto mt-[5%]">
        <div className="font-semibold">Continue as,</div>
        <div className="grid grid-cols-3 gap-2">
          <Link
            onClick={() => Handerole("admin")}
            className={` ${
              role === "admin" && "text-blue-400 ring-blue-400"
            } roles hover:ring-blue-400 hover:text-blue-400 trans`}
          >
            Admin
          </Link>
          <Link
            onClick={() => Handerole("lecturer")}
            className={` ${
              role === "lecturer" && "text-blue-400 ring-blue-400"
            } roles hover:ring-blue-400 hover:text-blue-400 trans`}
          >
            Lecturer
          </Link>
          <Link
            onClick={() => Handerole("student")}
            className={` ${
              role === "student" && "text-blue-400 ring-blue-400"
            } roles hover:ring-blue-400 hover:text-blue-400 trans`}
          >
            Student
          </Link>
        </div>
        <div className="font-semibold">Sign up with,</div>
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/auth/sign-in/email`}
            className="roles hover:ring-blue-400 hover:text-blue-400 trans"
          >
            <MailIcon className="size-5" />
            <span>Email</span>
          </Link>
          <Link
            to={`/auth/sign-in/google/:fbURL`}
            className="roles hover:ring-blue-400 hover:text-blue-400 trans"
          >
            <img className="size-5" src={Google} />
            <span>Google</span>
          </Link>
        </div>
        <div className="flex justify-center items-center mt-7">
          <Link
            className="w-[80%] m-auto text-center ring-[.5px] py-2 hover:bg-indigo-400/50"
            to={`/auth/sign-up`}
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
