import React, { useContext, useState } from "react";
import Input from "../customs/Input";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader, Lock, Mail } from "lucide-react";
import { Globalstate } from "../../contexts/Usecontext";
import { useAuthstore } from "../../store/Authstore";
import toTitleCase from "../../hooks/to_title";

const Emailsignin = () => {
  const { role } = useContext(Globalstate);
  const { signin, isLoading, userID } = useAuthstore();

  const navigate = useNavigate();
  const defaultData = {
    email: "",
    password: "",
    role: role,
  };
  const [userData, setuserData] = useState(defaultData);
  const Handleonchange = (e) => {
    const { value, name } = e.target;
    setuserData({ ...userData, [name]: value });
  };

  const [showPasswd, setshowPasswd] = useState(false);

  const Handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signin(userData);
      localStorage.setItem("user", toTitleCase(res.username));
      navigate(`/dash/${res.role}/${res._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`w-[410px] h-max flex flex-col gap-5 -mt-[10%]`}>
      <div className="text-center font-tektur font-extrabold max-md:text-xl text-2xl">
        Log into emarker
      </div>
      <div className="text-center font-semibold text-lg">
        Or use{" "}
        <Link
          to={`/auth/sign-in/google/:fbURL`}
          className="text-blue-400 hover:underline"
        >
          {" "}
          Google
        </Link>
      </div>
      <form
        onSubmit={Handlesubmit}
        className="flex flex-col gap-4 max-md:text-sm"
        action=""
      >
        <Input
          name={"email"}
          type={`email`}
          label={`Email address`}
          placeholder={`Your verified email`}
          icon1={Mail}
          onchange={Handleonchange}
        />{" "}
        <Input
          name={"password"}
          type={`${showPasswd ? "text" : "password"}`}
          label={`Password`}
          placeholder={`Password`}
          icon1={Lock}
          icon2={showPasswd ? Eye : EyeOff}
          onchange={Handleonchange}
          ontap={() => setshowPasswd((c) => (c = !c))}
        />
        <div
          className={`font-semibold text-blue-400 hover:underline text-center `}
        >
          <Link to={`/auth/forgot-password`}>Forgot password?</Link>
        </div>
        <div className="flex justify-center items-center mt-3">
          <button
            type="submit"
            className="ml-2 px-4 py-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer flex justify-center items-center"
          >
            {isLoading ? (
              <Loader className="size-5 animate-spin" />
            ) : (
              <span>Log in</span>
            )}
          </button>
        </div>
      </form>
      <div className="text-center font-semibold mt-5">
        <span>New to emarker?</span>{" "}
        <Link
          className="text-blue-400 hover:underline"
          to={`/auth/sign-up/email`}
        >
          Sign up
        </Link>{" "}
        <span>for free</span>
      </div>
    </div>
  );
};

export default Emailsignin;
