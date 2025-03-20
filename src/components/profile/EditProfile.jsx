import React, { useState } from "react";
import {
  ChevronLeft,
  Camera,
  Moon,
  Sun,
  Pencil,
  Calendar,
  Briefcase,
  MapPin,
} from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] flex items-center justify-center">
        <div className="bg-[#1A1A1A] p-6 rounded-2xl backdrop-blur-xl bg-opacity-50 border border-gray-800">
          <p className="text-red-400">Something went wrong!</p>
        </div>
      </div>
    );
  }

  if (status === "success" && Object.keys(student).length === 0) {
    navigate(`/register?tele_id=${id}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] text-white">
      {/* Header */}
      <div className="px-6 py-6 flex items-center justify-between bg-[#1A1A1A]/90 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-indigo-400" />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            {isEditing ? "Edit Profile" : "Profile"}
          </h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 transition-all"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-indigo-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-400" />
          )}
        </button>
      </div>

      <div className="max-w-md mx-auto px-2 py-8">
        {status === "success" && student && (
          <>
            {/* Profile Image */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-75 blur"></div>
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-[3px]">
                      <div className="bg-[#1A1A1A] rounded-full p-[2px] h-full">
                        <AvatarImage
                          className="rounded-full w-full h-full object-cover"
                          src={binaryImage || student.imgurl}
                          alt="Profile"
                        />
                        <AvatarFallback className="rounded-full text-4xl w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-400">
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
                      className="absolute bottom-0 right-0 bg-[#1A1A1A] p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 transition-all shadow-lg"
                    >
                      <Camera className="w-5 h-5 text-indigo-400" />
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
              </div>
            </div>

            {/* Quick Stats */}
            <div
              className={`grid grid-cols-2 gap-3 mb-6 px-2 ${
                isEditing ? "hidden" : "block"
              }`}
            >
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-xl">
                <Calendar className="w-5 h-5 text-indigo-400 mb-2" />
                <p className="text-xs text-gray-400">Joined</p>
                <p className="text-lg font-bold">2024</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-xl">
                <Briefcase className="w-5 h-5 text-purple-400 mb-2" />
                <p className="text-xs text-gray-400">Role</p>
                <p className="text-lg font-bold">Student</p>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="w-[50%] font-semibold m-auto mb-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-full  shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}

            {/* Profile Information */}
            <div className="bg-[#1A1A1A] p-2 rounded-2xl backdrop-blur-xl bg-opacity-50 border border-gray-800">
              {isEditing ? (
                <EditMode
                  student={student}
                  setIsEditing={setIsEditing}
                  imageFile={imageFile}
                />
              ) : (
                <ViewMode student={student} setIsEditing={setIsEditing} />
              )}
            </div>
          </>
        )}

        {status === "error" && (
          <div className="bg-[#1A1A1A] p-6 rounded-2xl backdrop-blur-xl bg-opacity-50 border border-gray-800">
            <p className="text-red-400">Error loading profile data</p>
          </div>
        )}

        {status === "loading" && (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
