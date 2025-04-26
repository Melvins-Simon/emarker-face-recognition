import { BookCheck, Home, LogOut, Menu, User } from "lucide-react";
import React, { useState } from "react";
import Logo from "../Logo";
import { Link } from "react-router-dom";

const Studentdash = () => {
  const [isLoading, setisLoading] = useState(false);
  return (
    <div className="bg-indigo-600/50 h-full w-full  rounded-2xl relative overflow-hidden pt-3">
      <div className=" px-[5%] lg:px-0 lg:w-[60%] lg:mx-auto w-full flex items-center justify-between">
        <Menu className="size-8 cursor-pointer" />
        <div>Welcome Melvins!</div>
      </div>
      <div className=" w-[90%] lg:w-[60%] lg:mx-auto h-full mx-auto pt-2 flex flex-col gap-3">
        <Logo />
        <div
          className={`size-64 mx-auto bg-gray-300 ${
            isLoading && "animate-pulse"
          } rounded-full mt-12 flex justify-center items-center overflow-hidden`}
        >
          {isLoading ? (
            <User className="size-32" />
          ) : (
            <img
              className="object-center object-cover h-full w-full"
              src="https://shorturl.at/ZB7ze"
            />
          )}
        </div>
        <div className="grid grid-cols-2 lg:w-[60%] lg:mx-auto h-[40%] mt-7 gap-3 ">
          <div className="bg-white rounded-2xl">u</div>
          <div className="bg-white rounded-2xl">u</div>
          <div className="bg-white rounded-2xl">u</div>
          <div className="bg-white rounded-2xl">u</div>
        </div>
      </div>
      <div className="w-full lg:w-[60%] lg:mx-auto inset-x-0 absolute bottom-0 h-[7%] bg-neutral-100 flex justify-center items-center gap-2 px-[10%]">
        <Link className="bg-indigo-600 h-[80%] w-1/4 hover:opacity-80 active:opacity-50 trans  flex justify-center items-center rounded-md">
          <Home className="size-7 text-yellow-200" />
        </Link>
        <Link className="bg-blue-600 h-[80%] w-1/4 hover:opacity-80 active:opacity-50 trans  flex justify-center items-center rounded-md">
          <User className="size-7" />
        </Link>
        <Link className="bg-blue-600 h-[80%] w-1/4 hover:opacity-80 active:opacity-50 trans  flex justify-center items-center rounded-md">
          <BookCheck className="size-7" />
        </Link>
        <Link className="bg-blue-600 h-[80%] w-1/4 hover:opacity-80 active:opacity-50 trans  flex justify-center items-center rounded-md">
          <LogOut className="size-7" />
        </Link>
      </div>
    </div>
  );
};

export default Studentdash;
