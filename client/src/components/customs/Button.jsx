import React from "react";
import { Link } from "react-router-dom";

const Button = () => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute -inset-[1px] rounded-lg overflow-hidden">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 border-conic-gradient opacity-100 animate-spin-slow" />
        </div>
      </div>

      <Link
        to={`/auth/sign-up`}
        className="relative bg-slate-800 text-white px-8 py-1 rounded-md text-md font-medium  hover:text-indigo-50 hover:bg-indigo-800 trans active:scale-[0.98] active:bg-indigo-400"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Button;
