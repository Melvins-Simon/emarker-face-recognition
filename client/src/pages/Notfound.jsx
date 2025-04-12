import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Notfound = () => {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-r from-cyan-200 via-indigo-200 to-blue-200 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-2xl font-semibold text-indigo-600">404: Error!</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to={"/"}
            className="flex justify-center items-center bg-blue-500 hover:bg-blue-600 trans px-3 py-1 rounded-md"
          >
            <ArrowLeft className="size-5" /> Return
          </Link>
          <Link className="flex justify-center items-center hover:ring text-blue-600 hover:ring-blue-600 trans px-3 py-1 rounded-md">
            Contact support
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Notfound;
