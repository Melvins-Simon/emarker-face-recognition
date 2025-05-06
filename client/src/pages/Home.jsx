import React from "react";
import { Button, Logo } from "../components";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
const Home = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 overflow-hidden -z-20">
        <video src="/stars.mp4" autoPlay muted loop />
      </div>
      <div className="lg:w-[63%] w-[95%] mx-auto h-full relative ">
        <nav className="absolute pt-5 top-0 w-full flex justify-between items-center">
          <Logo />
          <Button />
        </nav>

        <div className="bg-gradient-to-b from-indigo-600/70 to-transparent ring-1 ring-indigo-600 hover:ring-green-600  trans h-[30%] absolute bottom-0 inset-x-0 rounded-t-2xl overflow-hidden hover:shadow-[1px_1px_20px] transition-all shadow-green-600">
          <img
            src={`/ai2.jpeg`}
            className="object-cover w-full h-full object-center"
          />
        </div>
        <div className="bg-indigo-600 blur-[40rem] absolute inset-0 rounded-t-2xl -z-10" />
        <div className="ring-[.5px] ring-indigo-600 p-3 hover:ring-green-600 trans  absolute inset-x-0 top-[15%] max-sm:top-[10%] w-[80%] max-sm:w-[90%] h-[50%] max-sm:h-[55%] m-auto flex flex-col justify-evenly gap-3 z-20">
          <div className="text-center text-5xl max-sm:text-xl font-extrabold flex justify-center items-center">
            <p className="font-tektur bg-gradient-to-b from-white to-gray-400 w-max text-transparent bg-clip-text">
              Unleash the Power of Automated Attendance System
            </p>
          </div>
          <div className="text-center max-md:text-sm -mt-3">
            <span>
              Say goodbye to manual roll calls and outdated attendance sheets!
              Our AI-powered Attendance System revolutionizes the way
              organizations track presence—seamlessly, securely, and in
              real-time. Using face-api.js for instant face recognition and
              built on the MERN stack, it delivers blazing-fast, error-free
              check-ins with automated reports and robust security. Transform
              attendance management today—where technology meets convenience!
            </span>
          </div>
          <div className="text-center font-semibold text-lg animate-bounce">
            <span className="textgr ">Fast, Accurate & Contactless!</span>
          </div>
          <div className="flex justify-center items-center max-md:hidden gap-3">
            <Link
              className="bg-white w-[30%] text-indigo-600 hover:text-white hover:bg-indigo-600  active:opacity-50 trans text-center py-2 rounded-md cursor-pointer font-semibold"
              onClick={() =>
                toast.error("This feature is still under constructio! 🚧 ")
              }
            >
              About us
            </Link>
            <Link
              className="bg-indigo-600 w-[30%] text-white hover:bg-white hover:text-indigo-600  active:opacity-50 trans text-center py-2 rounded-md cursor-pointer font-semibold"
              to={"/auth/sign-up"}
            >
              {window.innerWidth <= 480 ? "Explore" : "Explore the system"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
