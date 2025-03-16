import { useDarkMode } from "@/DarkModeProvider";
import React from "react";

export default function InputComponents({ field, index, handleChange }) {
  const { isDarkMode } = useDarkMode();
  return (
    <div key={index} className="group">
      <label
        className={`block text-sm font-medium ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        } mb-2 group-focus-within:text-blue-500 transition-colors`}
      >
        {field.label}
      </label>
      <div className="relative">
        <field.icon
          className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${
            isDarkMode ? "text-gray-500" : "text-gray-400"
          } group-focus-within:text-blue-500 transition-colors`}
        />
        <input
          type={field.type}
          placeholder={field.placeholder}
          name={field.name}
          min={field.min}
          max={field.max}
          onChange={(e) => handleChange(e)}
          className={`w-full text-[16px] pl-11 pr-4 py-3 border ${
            isDarkMode
              ? "border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-gray-200"
              : "border-gray-200 bg-white/50 hover:bg-white text-gray-900"
          } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
        />
      </div>
    </div>
  );
}
