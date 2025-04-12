import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Notauthorized = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center ">
      <div className="flex items-center flex-col gap-2">
        <code className="text-5xl text-red-600 font-semibold ">
          Access Denied
        </code>

        <span className="w-full h-1 bg-white rounded-full" />
        <h3 className="">You are not allowed to view this page.</h3>
        <h3 className="text-lg">🚫🚫🚫🚫</h3>
        <h6 className="text-red-600 text-lg">error code:403 forbidden</h6>
        <Link
          to={"/"}
          className="flex justify-center items-center bg-red-500 hover:bg-blue-500 trans px-3 py-1 rounded-md"
        >
          <ArrowLeft className="size-5" /> Return
        </Link>
      </div>
    </div>
  );
};

export default Notauthorized;
