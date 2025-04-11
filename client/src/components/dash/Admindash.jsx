import React from "react";
import { useAuthstore } from "../../store/Authstore";
import toTitleCase from "../../hooks/to_title";
import { Link, useNavigate } from "react-router-dom";

const Admindash = () => {
  const navigate = useNavigate();
  const { signout, user } = useAuthstore();
  const Handlesignout = async () => {
    try {
      await signout();
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-green-500">
      <div>{`Welcome ${toTitleCase(user.username)}`}</div>
      <div>
        <button className="cursor-pointer" onClick={Handlesignout}>
          Sign out
        </button>
        <Link className="cursor-pointer" to={"/auth/forgot-password"}>
          Reset password
        </Link>
      </div>
    </div>
  );
};

export default Admindash;
