import { useState } from "react";
import "./Register.css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useLocation } from "react-router-dom";
import { addStudent, checkUser, uploadeImage } from "@/lib/utils";
import { useDarkMode } from "@/DarkModeProvider";
import { inputFields } from "./data";
import InputComponents from "./InputComponents";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader";

const Register = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [imageBinary, setImageBinary] = useState(null); // For storing the binary data
  const [countryCode, setCountryCode] = useState("+251");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const telegram_id = queryParams.get("tele_id");
  const [stat, setstat] = useState(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const {
    data: user,
    error,
    status,
  } = useQuery({
    queryKey: ["user", telegram_id],
    queryFn: async () => checkUser(telegram_id),
  });
  const [formData, setFormData] = useState({
    name: "",
    sex: "",
    age: "",
    grade: "",
    school: "",
    city: "",
    region: "",
    phoneNumber: "",
  });
  console.log();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      setFile(file);
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setImagePreview(reader.result);

        const binaryReader = new FileReader();
        binaryReader.readAsArrayBuffer(file);
        binaryReader.onloadend = () => {
          const arrayBuffer = binaryReader.result;
          const binaryData = new Uint8Array(arrayBuffer);
          setImageBinary(binaryData); // Store binary data in state

          console.log("Binary Data:", binaryData); // For debugging
        };
      };
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(formData).some((value) => !value)) {
      setstat("Fill all fields!");
      return;
    }

    setIsLoading(true);
    const newformData = new FormData();
    newformData.append("file", file);
    newformData.append("upload_preset", "victory_bot");
    newformData.append("cloud_name", "dud4t1ptn");
    const { url } = await uploadeImage(newformData);
    const dataToSubmit = {
      ...formData,
      telegram_id,
      phoneNumber: countryCode + formData.phoneNumber,
      imgurl: url,
    };
    try {
      await addStudent(dataToSubmit);
      setstat("success");
    } catch (err) {
      setstat("Connection issue. please check your internet and try again!");
    } finally {
      setIsLoading(false);
    }
  };

  if (status == "pending") {
    return <Loader />;
  }
  if (status == "error") {
    return (
      <div className="flex h-screen justify-center items-center">
        <div>
          <p>Something went wrong!</p>
          <button>Refresh</button>
        </div>
      </div>
    );
  }
  if (status == "success" && user.student) {
    return <SuccessAlert message="Already Registered!" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-3 sm:px-6 lg:px-8 transition-colors duration-200">
      {stat === null || stat !== "success" ? (
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-lg mb-6">
              <img
                className="h-12 w-12"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white"
                alt="Victory"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Join the Challenge
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Register now to participate in exciting contests
            </p>
          </div>

          <div className="backdrop-filter  rounded-2xl shadow-xl p-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              {inputFields.slice(0, 1).map((field, index) => (
                <InputComponents
                  key={index}
                  field={field}
                  index={index}
                  handleChange={handleChange}
                />
              ))}
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2 group-focus-within:text-blue-500 transition-colors`}
                >
                  Sex
                </label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, sex: value })
                  }
                >
                  <SelectTrigger className="w-full mt-2 h-12">
                    <SelectValue placeholder="Select a gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {inputFields.slice(1).map((field, index) => (
                <InputComponents
                  key={index}
                  field={field}
                  index={index}
                  handleChange={handleChange}
                />
              ))}
              <div>
                <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                  Your Photo
                </label>
                <div className="mt-2  mb-5 flex items-center gap-2">
                  <label className="upload-box  hover:border-indigo-600">
                    <input
                      type="file"
                      accept="image/*"
                      dataToSubmit
                      onChange={handleImageUpload}
                      className="file-input"
                    />
                    <div className="upload-instructions">
                      <p>
                        <strong>Click to upload</strong>
                      </p>
                      <p>SVG, PNG, JPG or GIF (max 800x400px)</p>
                    </div>
                  </label>
                  {imageBinary && (
                    <img
                      src={imagePreview}
                      alt="Uploaded Preview"
                      className="photo-preview"
                    />
                  )}
                </div>
              </div>

              {/* stat Message */}
              {stat && stat !== "success" && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center">
                  <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {stat}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r  from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </div>
                ) : (
                  "Register Now"
                )}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Are you a member?{" "}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Join official victory channel
            </a>
          </p>
        </div>
      ) : (
        <SuccessAlert message="Successfully registered!" />
      )}
    </div>
  );
};

// import React from "react";

const SuccessAlert = ({ message }) => {
  return (
    <div className="h-screen px-1 bg-white dark:bg-gray-900">
      <div className="h-full flex items-center justify-center">
        <div className="border-green-500 shadow-md dark:bg-gray-800 flex w-full rounded-lg border-l-[6px] bg-white px-7 py-8 md:p-9">
          <div className="bg-green-100 mr-5 flex h-[34px] w-[34px] items-center justify-center rounded-md">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_961_15629)">
                <path
                  d="M8.99998 0.506256C4.3031 0.506256 0.506226 4.30313 0.506226 9.00001C0.506226 13.6969 4.3031 17.5219 8.99998 17.5219C13.6969 17.5219 17.5219 13.6969 17.5219 9.00001C17.5219 4.30313 13.6969 0.506256 8.99998 0.506256ZM8.99998 16.2563C5.00623 16.2563 1.77185 12.9938 1.77185 9.00001C1.77185 5.00626 5.00623 1.77188 8.99998 1.77188C12.9937 1.77188 16.2562 5.03438 16.2562 9.02813C16.2562 12.9938 12.9937 16.2563 8.99998 16.2563Z"
                  fill="#22AD5C"
                />
                <path
                  d="M11.4187 6.38438L8.07183 9.64688L6.55308 8.15626C6.29996 7.90313 5.90621 7.93126 5.65308 8.15626C5.39996 8.40938 5.42808 8.80313 5.65308 9.05626L7.45308 10.8C7.62183 10.9688 7.84683 11.0531 8.07183 11.0531C8.29683 11.0531 8.52183 10.9688 8.69058 10.8L12.3187 7.31251C12.5718 7.05938 12.5718 6.66563 12.3187 6.41251C12.0656 6.15938 11.6718 6.15938 11.4187 6.38438Z"
                  fill="#22AD5C"
                />
              </g>
              <defs>
                <clipPath id="clip0_961_15629">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="w-full">
            <h5 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
              {message}
            </h5>
            <p className="mb-6 text-base leading-relaxed text-gray-700 dark:text-gray-400">
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text">
                Welcome, challenger!
              </span>{" "}
              💪 Your journey starts now. Compete, earn rewards, and climb the
              leaderboard. Ready to take on your first contest? 🔥
            </p>
            <div className="flex">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-block font-semibold mr-6 text-sm text-green-500 hover:text-green-700"
              >
                Continue
              </a>
              <button className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
