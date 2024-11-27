import React from "react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { NavLink } from "react-router-dom";
import GroupInput from "./GroupInput";

function Profile() {
  const l = {
    name: "",
    sex: "",
    age: "",
    grade: "",
    school: "",
    city: "",
    region: "",
    phoneNumber: "",
  };
  return (
    <div className="h-screen w-full flex flex-col">
      <div className=" relative bg-fadeGreen flex-1">
        <div className="top-0 w-full absolute  flex justify-between items-center  p-4 pl-3">
          <NavLink to={"/leaderbord"} className="text-4xl">
            <MdOutlineKeyboardArrowLeft />
          </NavLink>
        </div>
        <header className="  flex justify-center items-center p-4">
          <div className="text-2xl"> Profile</div>
        </header>
        <div className="w-full flex bottom-0 mb-[-70px] justify-center absolute ">
          <div className="rounded-[50%] overflow-hidden border border-[4px] border-[#004643]">
            <img src="./profile.jpg" className="w-[140px] h-[140px]" alt="" />
          </div>
        </div>
      </div>
      <div className="bg-background flex-3 w-full pl-8 pr-8 pt-[90px]">
        <div className="w-full flex justify-center">
          <button className="py-2 px-4 text-background bg-foreground rounded text-lg">
            edit profile
          </button>
        </div>
        <div className="flex w-full flex-col">
          <GroupInput labelName={"Name"} placeholder={"abebe demsew"} />
          <GroupInput labelName={"Name"} placeholder={"abebe demsew"} />
          <GroupInput labelName={"Name"} placeholder={"abebe demsew"} />
          <GroupInput labelName={"Name"} placeholder={"abebe demsew"} />
          <GroupInput labelName={"Name"} placeholder={"abebe demsew"} />
          <GroupInput labelName={"Name"} placeholder={"abebe demsew"} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
