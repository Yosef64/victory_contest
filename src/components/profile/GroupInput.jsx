import React from "react";

function GroupInput({ DataSet, editMode, userData, setuserData }) {
  const { placeholder, labelName, dataName } = DataSet;
  return (
    <div className=" border-gray-400  mb-2 pl-2 rounded-lg">
      <label className="block text-xl text-gray-500 ">{labelName}</label>
      {editMode ? (
        <>
          <input
            type="text"
            placeholder={placeholder}
            className=" w-full   border-none focus:outline-none  text-xl m-0 ml-0 p-0  "
            value={userData[dataName]}
            onChange={(e) => {
              setuserData((prev) => ({
                ...prev,
                [dataName]: e.target.value, // Dynamically updating the correct key
              }));
            }}
          />
        </>
      ) : (
        <div className=" text-xl text-black"> {userData[dataName]}</div>
      )}
      <div
        className={`border-b mb-0.5 ${
          editMode ? "border-gray-800" : " border-gray-300"
        }`}
      ></div>
    </div>
  );
}

export default GroupInput;
