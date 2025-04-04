import React, { useContext, useState } from "react";
import Input from "../customs/Input";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Globalstate } from "../../contexts/Usecontext";
import PasswordStrengthMeter from "../Passwordstrength";
import VerificationCode from "../VerificationCode";

const Emailsignup = () => {
  const { role } = useContext(Globalstate);
  const defaultData = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: role,
  };
  const [userData, setuserData] = useState(defaultData);
  const Handleonchange = (e) => {
    const { value, name } = e.target;
    setuserData({ ...userData, [name]: value });
  };

  const [showPasswd, setshowPasswd] = useState(false);

  return (
    <div className={`w-[410px] h-max flex flex-col gap-3 `}>
      <div className="text-center font-tektur font-extrabold text-2xl">
        Set your account credentials
      </div>
      <div className="text-center font-semibold text-lg">
        Or use{" "}
        <Link
          to={`/auth/sign-up/sso`}
          className="text-blue-400 hover:underline"
        >
          SSO
        </Link>
      </div>
      <form className="flex flex-col gap-2" action="">
        <Input
          name={"username"}
          type={`text`}
          label={`User name`}
          placeholder={`What others will see`}
          icon1={User}
          onchange={Handleonchange}
        />
        <Input
          name={"email"}
          type={`email`}
          label={`Email address`}
          placeholder={`Work or school email works best`}
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
        />{" "}
        <Input
          name={"confirmPassword"}
          type={`${showPasswd ? "text" : "password"}`}
          label={`Confirm password`}
          placeholder={`Confirm password`}
          icon1={Lock}
          icon2={showPasswd ? Eye : EyeOff}
          onchange={Handleonchange}
          ontap={() => setshowPasswd((c) => (c = !c))}
        />
        <div
          className={`-my-2 text-center text-red-500 ${
            (!userData.confirmPassword && userData.password) ||
            userData.password === userData.confirmPassword
              ? "hidden"
              : ""
          } `}
        >
          <span>Password does not match</span>
        </div>
        <PasswordStrengthMeter password={userData.password} />
        <VerificationCode />
        <div className="flex justify-center items-center mt-3">
          <button className="ml-2 px-4 py-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
            Create account
          </button>
        </div>
      </form>
      <div className="text-center font-semibold mt-5">
        <span>Already have an account?</span>{" "}
        <Link
          className="text-blue-400 hover:underline"
          to={`/auth/sign-in/email`}
        >
          Log in
        </Link>{" "}
        <span>instead</span>
      </div>
    </div>
  );
};

export default Emailsignup;
