import React, { useState } from "react";
import Input from "../customs/Input";
import { Eye, EyeOff, Lock } from "lucide-react";

import PasswordStrengthMeter from "../Passwordstrength";
import { useAuthstore } from "../../store/Authstore";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const Resetpassword = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const { reset_password } = useAuthstore();
  const defaultData = {
    newPassword: "",
    confirmNewPassword: "",
    id,
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
      await reset_password(userData);
      navigate("/auth/sign-in/email");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={`w-[410px] h-max flex flex-col gap-3 -mt-[10%]`}>
      <div className="text-center font-tektur font-extrabold text-2xl mb-2">
        Set your new password
      </div>
      <form onSubmit={Handlesubmit} className="flex flex-col gap-2" action="">
        <Input
          name={"newPassword"}
          type={`${showPasswd ? "text" : "password"}`}
          label={`Password`}
          placeholder={`Password`}
          icon1={Lock}
          icon2={showPasswd ? Eye : EyeOff}
          onchange={Handleonchange}
          ontap={() => setshowPasswd((c) => (c = !c))}
        />{" "}
        <Input
          name={"confirmNewPassword"}
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
            (!userData.confirmNewPassword && userData.newPassword) ||
            userData.newPassword === userData.confirmNewPassword
              ? "hidden"
              : ""
          } `}
        >
          <span>Password does not match</span>
        </div>
        <PasswordStrengthMeter password={userData.newPassword} />
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

export default Resetpassword;
