import React from "react";

const Button = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="absolute -inset-[2px] rounded-lg overflow-hidden">
          <div className="relative h-full w-full">
            <div className="absolute inset-0 border-conic-gradient opacity-100 animate-spin-slow" />
          </div>
        </div>

        <button className="relative bg-slate-900 text-white px-8 py-1 rounded-lg text-sm font-medium border border-transparent cursor-pointer hover:text-indigo-50 hover:bg-slate-800 trans active:scale-[0.98] active:bg-slate-700">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Button;
