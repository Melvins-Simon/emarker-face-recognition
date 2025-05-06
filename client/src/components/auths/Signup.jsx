import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LockKeyhole, MailIcon } from "lucide-react";
import { Globalstate } from "../../contexts/Usecontext";
const Signup = () => {
  const { role, setRole } = useContext(Globalstate);
  const Handerole = (role) => {
    setRole(role);
    localStorage.setItem("role", role);
  };
  return (
    <div
      className={` w-[410px] h-max flex flex-col gap-5 -mt-[10%] max-md:-mt-[30%]`}
    >
      <div className="text-center font-tektur font-extrabold text-2xl">
        Create your emarker account
      </div>
      <div className="text-lg font-semibold text-center max-md:text-sm">
        By signing up, you agree to our{" "}
        <Link className="text-blue-400 hover:underline">terms of service</Link>
      </div>
      <div className="flex flex-col gap-5 w-[80%] mx-auto mt-[5%] max-md:text-sm">
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
            to={`/auth/sign-up/email`}
            className="roles hover:ring-blue-400 hover:text-blue-400 trans"
          >
            <MailIcon className="size-5" />
            <span>Email</span>
          </Link>
          <Link
            to={`/auth/sign-up/sso`}
            className="roles hover:ring-blue-400 hover:text-blue-400 trans"
          >
            <LockKeyhole className="size-5" />
            <span>SSO</span>
          </Link>
        </div>
        <div className="flex justify-center items-center mt-7">
          <Link
            className="w-[80%] m-auto text-center ring-[.5px] py-2 hover:bg-indigo-400/50"
            to={`/auth/sign-in`}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
