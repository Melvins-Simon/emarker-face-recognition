import React from "react";
import { Button } from "../components";

const Home = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 overflow-hidden -z-20">
        <video src="/stars.mp4" autoPlay muted loop />
      </div>
      <div className="w-[63%] mx-auto h-full relative ">
        <nav className="absolute pt-5 top-0 w-full flex justify-between items-center">
          <div className="text-2xl font-extrabold font-tektur bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text">
            Emarker
          </div>
          <Button />
        </nav>

        <div className="bg-gradient-to-b from-indigo-600/70 to-transparent ring-1 ring-violet-600 h-[30%] absolute bottom-0 inset-x-0 rounded-t-2xl" />
        <div className="bg-indigo-600 blur-[30rem] absolute inset-0 rounded-t-2xl -z-10" />
        <div className="bg-indigo-600/10 ring-[.5px] ring-indigo-600 p-3   absolute inset-x-0 top-[20%] -z-10 w-[80%] h-[40%] m-auto">
          <div className="text-center text-5xl font-extrabold font-tektur">
            <span>Unleash the power of automated systems</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
