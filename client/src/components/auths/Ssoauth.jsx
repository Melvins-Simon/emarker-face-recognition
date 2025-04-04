import React, { useContext, useState } from "react";
import Input from "../customs/Input";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const Ssoauth = () => {
  const [userData, setuserData] = useState("");
  const [submited, setsubmited] = useState(false);
  const [domain, setdomain] = useState("");
  const Handleonchange = (e) => {
    const { value } = e.target;
    setuserData(value);
  };
  const Handlesubmit = (e) => {
    setsubmited(true);
    e.preventDefault();
    const domain = userData.split("@")[1];
    setdomain(`@${domain}`);
  };
  console.log(userData);
  console.log(domain);

  return (
    <div className={`w-[410px] h-max flex flex-col gap-5 -mt-[10%]`}>
      <div className="text-center font-tektur font-extrabold text-2xl">
        Setup emarker with SSO
      </div>
      <div className="text-center font-semibold text-lg">
        Or use{" "}
        <Link
          to={`/auth/sign-up/email`}
          className="text-blue-400 hover:underline"
        >
          {" "}
          Email
        </Link>
      </div>
      <form onSubmit={Handlesubmit} className="flex flex-col gap-4" action="">
        <Input
          name={"email"}
          type={`email`}
          label={`Email address`}
          placeholder={`Work or student email`}
          icon1={Mail}
          onchange={Handleonchange}
        />
        {submited && (
          <div className={`-my-2 text-center text-red-500 `}>
            <span>
              {domain === "@gmail.com"
                ? "Please click the Email button to sign up with Gmail"
                : `SSO has not been enabled for ${domain}`}
            </span>
          </div>
        )}
        <div className="flex justify-center items-center mt-3">
          <button
            type="submit"
            className="ml-2 px-4 py-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
          >
            Continue with SSO
          </button>
        </div>
      </form>
    </div>
  );
};

export default Ssoauth;
