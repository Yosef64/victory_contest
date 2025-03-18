import React, { useState } from "react";
import {
  ChevronLeft,
  Camera,
  User,
  Mail,
  Lock,
  Calendar,
  Globe,
  Building2,
  GraduationCap,
  School,
  Moon,
  Sun,
  Pencil,
} from "lucide-react";
import { useDarkMode } from "@/DarkModeProvider";
import { useQuery } from "@tanstack/react-query";
import { checkUser } from "@/lib/utils";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "../Loader";
import { data } from "autoprefixer";

function EditProfile() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: student,
    error,
    status,
  } = useQuery({
    queryKey: ["student"],
    queryFn: async () => checkUser(id),
  });

  if (status === "success" && Object.keys(student).length === 0) {
    navigate(`/register?tele_id=${id}`);
  }

  const ViewMode = () => (
    <div className="space-y-6">
      <div
        className={`p-6 rounded-2xl ${
          isDarkMode ? "bg-gray-800/50" : "bg-white"
        } shadow-lg`}
      >
        <div className="space-y-4">
          {[
            { label: "Name", value: student.name, icon: User },
            { label: "Email", value: student.email, icon: Mail },
            {
              label: "Date of Birth",
              value: new Date(student.dateOfBirth).toLocaleDateString(),
              icon: Calendar,
            },
            { label: "Region", value: student.region, icon: Globe },
            {
              label: "City",
              value: student.city || "Not specified",
              icon: Building2,
            },
            {
              label: "Grade",
              value: student.grade || "Not specified",
              icon: GraduationCap,
            },
            {
              label: "School",
              value: student.school || "Not specified",
              icon: School,
            },
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                />
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </p>
                <p
                  className={`font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className={`mt-6 w-full flex items-center justify-center space-x-2 ${
            isDarkMode
              ? "bg-gradient-to-r from-blue-600 to-blue-400 shadow-blue-500/10"
              : "bg-gradient-to-r from-blue-900 to-blue-700 shadow-blue-500/20"
          } text-white w-[50%] m-auto py-2 rounded-[40px] font-medium shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transform transition-all duration-300 hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:outline-none`}
        >
          <Pencil className="w-3 h-3" />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );

  const EditMode = () => (
    <div className="space-y-6">
      {[
        {
          label: "Name",
          icon: User,
          value: student.name,
          type: "text",
        },
        { label: "Email", icon: Mail, value: student.email, type: "email" },

        {
          label: "Date of Birth",
          icon: Calendar,
          value: student.dateOfBirth,
          type: "date",
        },
        {
          label: "Country/Region",
          icon: Globe,
          value: student.region,
          type: "text",
        },
        {
          label: "City",
          icon: Building2,
          value: student.city,
          type: "text",
          placeholder: "Enter your city",
        },
        {
          label: "Grade",
          icon: GraduationCap,
          value: student.grade,
          type: "number",
          placeholder: "Enter your grade",
          min: 1,
          max: 12,
        },
        {
          label: "School",
          icon: School,
          value: student.school,
          type: "text",
          placeholder: "Enter your school name",
        },
      ].map((field, index) => (
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
              defaultValue={field.value}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              className={`w-full text-[16px] pl-11 pr-4 py-3 border ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-gray-200"
                  : "border-gray-200 bg-white/50 hover:bg-white text-gray-900"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
            />
          </div>
        </div>
      ))}

      <div className="flex space-x-4">
        <button
          onClick={() => setIsEditing(false)}
          className={`w-full py-1 rounded-xl font-medium transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Cancel
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className={`w-full ${
            isDarkMode
              ? "bg-gradient-to-r from-blue-600 to-blue-400 shadow-blue-500/10"
              : "bg-gradient-to-r from-blue-900 to-blue-700 shadow-blue-500/20"
          } text-white py-2 rounded-lg font-medium shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transform transition-all duration-300 hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:outline-none`}
        >
          Save changes
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gradient-to-b from-gray-50 to-white"
      }`}
    >
      {/* Header */}
      <div
        className={`px-6 py-6 flex items-center justify-between border-b ${
          isDarkMode
            ? "border-gray-800 bg-gray-900/80"
            : "border-gray-100 bg-white/80"
        } backdrop-blur-sm sticky top-0 z-10`}
      >
        <div className="flex items-center">
          <button
            className={`p-2 ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            } rounded-full transition-colors`}
          >
            <ChevronLeft
              className={`w-6 h-6 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            />
          </button>
          <h1 className="ml-4 text-2xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            {isEditing ? "Edit Profile" : "Profile"}
          </h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className={`p-2 ${
            isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
          } rounded-full transition-colors`}
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6 text-gray-300" />
          ) : (
            <Moon className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Profile Content */}
      <div className="px-6 py-8 max-w-2xl mx-auto">
        {/* Profile Image */}
        {status === "success" && (
          <div className="flex justify-center mb-12">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative">
                <img
                  src={student.imgurl}
                  alt="Profile"
                  className={`w-36 h-36 rounded-full object-cover ring-4 ${
                    isDarkMode ? "ring-gray-800" : "ring-white"
                  }`}
                />
                <button
                  className={`absolute bottom-0 right-0 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } p-3 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 group-hover:-translate-y-1`}
                >
                  <Camera
                    className={`w-5 h-5 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {status === "success" ? (
          isEditing ? (
            <EditMode />
          ) : (
            <ViewMode />
          )
        ) : status === "error" ? (
          <div>Erorr</div>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}

export default EditProfile;
