import React, { useContext, useState } from "react";
import Input from "../customs/Input";
import { Link } from "react-router-dom";
import { Eye, Lock, Mail, User } from "lucide-react";
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
  console.log(userData);

  return (
    <div className={`w-[410px] h-max flex flex-col gap-5 -mt-[10%] `}>
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
          type={`password`}
          label={`Password`}
          placeholder={`Password`}
          icon1={Lock}
          icon2={Eye}
          onchange={Handleonchange}
        />{" "}
        <Input
          name={"confirmPassword"}
          type={`password`}
          label={`Confirm password`}
          placeholder={`Confirm password`}
          icon1={Lock}
          icon2={Eye}
          onchange={Handleonchange}
        />
        <PasswordStrengthMeter password={userData.password} />
        <VerificationCode />
      </form>
    </div>
  );
};

export default Emailsignup;
