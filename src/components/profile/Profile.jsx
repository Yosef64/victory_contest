import React, { useState } from "react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { NavLink } from "react-router-dom";
import GroupInput from "./GroupInput";

function Profile() {
  const userDataSet = [
    { labelName: "name", placeholder: "abebe kebede", dataName: "name" },
    { labelName: "sex", placeholder: "male", dataName: "sex" },
    { labelName: "grade", placeholder: "10", dataName: "grade" },
    { labelName: "school", placeholder: "dsm", dataName: "school" },
    { labelName: "city", placeholder: "bahir dar", dataName: "city" },
    { labelName: "region", placeholder: "amahra", dataName: "region" },
    {
      labelName: "phone number",
      placeholder: "0909090909",
      dataName: "phoneNumber",
    },
  ];
  const [userData, setuserData] = useState({
    name: "tewodros tilahun",
    sex: "male",
    grade: "12",
    school: "dsm",
    city: "gonder",
    region: "amhara",
    phoneNumber: "0912341267",
  });

  const [editMode, setEditMode] = useState(false);

  return (
    <div className="h-screen w-full flex flex-col">
      <div className=" relative bg-fadeGreen flex-1 basis-1/4 flex-shrink-0 flex-grow-0">
        <div className="top-0 w-full absolute  flex justify-between items-center  p-4 pl-3">
          <NavLink to={"/LeaderBoard"} className="text-4xl">
            <MdOutlineKeyboardArrowLeft />
          </NavLink>
        </div>
        <header className="  flex justify-center items-center p-4">
          <div className="text-2xl"> Profile</div>
        </header>
        <div className="w-full flex bottom-0 mb-[-70px] justify-center absolute ">
          <div className="rounded-[50%] overflow-hidden  border-[4px] border-[#004643]">
            <img
              src="./../profile.jpg"
              className="w-[140px] h-[140px]"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="bg-background flex-3 w-full pl-6 pr-4 pt-[90px] pb-2">
        <div className="w-full flex justify-center">
          <button
            className={`py-2 px-4 text-background text-bold rounded text-lg font-medium ${
              editMode ? "bg-green-400" : "bg-blue-400"
            }
            }`}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Save Change" : "Edit Profile"}
          </button>
        </div>

        <div className="flex w-full flex-col">
          {userDataSet.map((input) => (
            <GroupInput
              DataSet={input}
              userData={userData}
              editMode={editMode}
              setuserData={setuserData}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
