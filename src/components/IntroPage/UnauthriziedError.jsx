import React from "react";
import { NavLink } from "react-router-dom";

const UnAuthorized = () => {
  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full m-auto px-4 flex justify-center items-center">
        <div className="text-center text-white flex flex-col justify-center items-center gap-4 px-9">
          <h2 className="mb-2 text-[50px] font-bold leading-none bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent sm:text-[80px] md:text-[100px]">
            403
          </h2>
          <p className="mb-3 text-[18px] font-semibold leading-tight text-white font-sans">
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent ">
              Oops!
            </span>{" "}
            <span className="opacity-80 text-md">
              You can't join the contest!
            </span>
          </p>
          <p className="mb-8 text-md text-white font-sans opacity-80">
            You aleady joined the contest! so be prepared for the next one!
          </p>
          <NavLink
            to={`/statistics/`}
            className="inline-block rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 border px-5 py-2 text-center text-base font-semibold text-white transition hover:bg-white hover:text-primary"
          >
            Go To Home
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default UnAuthorized;
