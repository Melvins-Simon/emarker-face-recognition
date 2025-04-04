import React, { useState } from "react";
import Input from "../customs/Input";
import { Eye, EyeOff, Lock } from "lucide-react";

import PasswordStrengthMeter from "../Passwordstrength";

const Resetpassword = () => {
  const defaultData = {
    password: "",
    confirmPassword: "",
  };
  const [userData, setuserData] = useState(defaultData);
  const Handleonchange = (e) => {
    const { value, name } = e.target;
    setuserData({ ...userData, [name]: value });
  };

  const [showPasswd, setshowPasswd] = useState(false);

  return (
    <div className={`w-[410px] h-max flex flex-col gap-3 -mt-[10%]`}>
      <div className="text-center font-tektur font-extrabold text-2xl mb-2">
        Set your new password
      </div>
      <form className="flex flex-col gap-2" action="">
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
        <div className="flex justify-center items-center mt-3">
          <button className="ml-2 px-4 py-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
            Reset password
          </button>
        </div>
      </form>
    </div>
  );
};

export default Resetpassword;
