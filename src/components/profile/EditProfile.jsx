import React, { useState } from "react";
import { ChevronLeft, Camera, Moon, Sun, Pencil } from "lucide-react";

import { useDarkMode } from "@/DarkModeProvider";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { checkUser } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ViewMode, EditMode } from "./ProfileMode";
import Loader from "../Loader";

function Profile() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isEditing, setIsEditing] = useState(false);
  const [binaryImage, setBinaryImage] = useState("");
  const [imageFile, setImageFile] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: student, status } = useQuery({
    queryKey: ["student"],
    queryFn: async () => checkUser(id),
  });

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      const image = files[0];
      setImageFile(image);
      const reader = new FileReader();
      reader.onload = () => {
        setBinaryImage(reader.result);
      };
      reader.readAsDataURL(image);
    }
  };
  if (status === "pending") {
    return <Loader />;
  }
  if (status === "error") {
    return (
      <div className="">
        <div className="">something went wrong!</div>
      </div>
    );
  }
  if (status === "success" && Object.keys(student).length === 0) {
    navigate(`/register?tele_id=${id}`);
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A]"
          : "bg-gradient-to-b from-gray-50 to-white"
      }`}
    >
      {/* Header */}
      <div
        className={`px-6 py-6 flex items-center justify-between border-b ${
          isDarkMode
            ? "border-gray-800 bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A]"
            : "border-gray-100 bg-white/80"
        } backdrop-blur-sm sticky top-0 z-10`}
      >
        <div className="flex items-center">
          <div
            onClick={() => navigate(-1)}
            className={`p-2 ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            } rounded-full transition-colors`}
          >
            <ChevronLeft
              className={`w-6 h-6 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            />
          </div>
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

      <div className="px-6 py-8 max-w-2xl mx-auto">
        {status === "success" && student && (
          <>
            {/* Profile Image */}
            <div className="flex justify-center mb-12">
              <div className="relative group">
                <div className="absolute -inset-0.5 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative">
                  <div>
                    <Avatar className="w-36 h-36">
                      <div className="inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-[3px]">
                        <div className="bg-white dark:bg-gray-900 rounded-full p-[2px] h-full">
                          <AvatarImage
                            className="rounded-full w-full h-full object-cover"
                            src={binaryImage || student.imgurl}
                            alt="Profile"
                          />
                          <AvatarFallback className="rounded-full text-4xl w-36 h-36">
                            {student.name[0]}
                          </AvatarFallback>
                        </div>
                      </div>
                    </Avatar>
                    {isEditing && (
                      <button
                        onClick={() =>
                          document.getElementById("fileInput")?.click()
                        }
                        className={`absolute bottom-0 right-0 ${
                          isDarkMode ? "bg-gray-800" : "bg-white"
                        } p-3 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 group-hover:-translate-y-1`}
                      >
                        <Camera
                          className={`w-5 h-5 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        />
                        <input
                          onChange={handleImageChange}
                          type="file"
                          id="fileInput"
                          accept="image/*"
                          hidden
                        />
                      </button>
                    )}
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`mt-6 w-full flex items-center justify-center space-x-2 ${
                        isDarkMode
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500  shadow-blue-500/10"
                          : "bg-gradient-to-r from-indigo-500 to-purple-500  shadow-blue-500/20"
                      } text-white w-[50%] m-auto py-2 rounded-[40px] font-medium shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transform transition-all duration-300 hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:outline-none`}
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Edit profile</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Information */}
            {isEditing ? (
              <EditMode
                student={student}
                setIsEditing={setIsEditing}
                imageFile={imageFile}
              />
            ) : (
              <ViewMode student={student} setIsEditing={setIsEditing} />
            )}
          </>
        )}

        {status === "error" && (
          <div className="text-red-500">Error loading profile data</div>
        )}

        {status === "loading" && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
