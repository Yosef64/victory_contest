import React from "react";

function GroupInput({ placeholder, labelName }) {
  return (
    <div className="">
      <label className="block text-xl ">{labelName}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full border-[#A9A9A9] outline-none text-xl m-2 ml-0 "
      />
    </div>
  );
}

export default GroupInput;
