import { useDarkMode } from "@/DarkModeProvider";
import { useState } from "react";
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
  X,
} from "lucide-react";
import { updateUser, uploadeImage } from "@/lib/utils";
import { useParams } from "react-router-dom";

const EditMode = ({ student, imageFile, setIsEditing }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(false);
  const { id } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setuserData((prevUserData) =>
      prevUserData.map((field) =>
        field.name === name ? { ...field, value } : field
      )
    );
  };
  const handleSaveChange = async () => {
    setIsLoading(true);
    try {
      const res = await uploadeImage(imageFile, id);
      const { secure_url } = res.message;
      const finalUserData = { imgurl: secure_url, telegram_id: id };
      userData.forEach((field) => {
        finalUserData[field.name] = field.value;
      });

      await updateUser(finalUserData);
      setIsEditing(false);
    } catch (error) {
      setErr(true);
    } finally {
      setIsLoading(false);
    }
  };
  const [userData, setuserData] = useState([
    {
      label: "Name",
      icon: User,
      value: student.name || "",
      type: "text",
      name: "name",
    },
    {
      label: "Date of Birth",
      icon: Calendar,
      value: student.age || "",
      type: "date",
      name: "age",
    },
    {
      label: "Region",
      icon: Globe,
      value: student.region || "",
      type: "text",
      name: "region",
    },
    {
      label: "City",
      icon: Building2,
      value: student.city || "",
      type: "text",
      name: "city",
    },
    {
      label: "Grade",
      icon: GraduationCap,
      value: student.grade || "",
      type: "number",
      name: "grade",
      min: 1,
      max: 12,
    },
    {
      label: "School",
      icon: School,
      value: student.school || "",
      type: "text",
      name: "school",
    },
  ]);
  return (
    <div className="space-y-6">
      {userData.map((field, index) => (
        <div key={field.name} className="group">
          {" "}
          {/* Use field.name as a stable key */}
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
              min={field.min}
              name={field.name}
              value={field.value}
              onChange={handleInputChange}
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
      {err && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center">
          <div className="flex-shrink-0">
            <X className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-800 dark:text-red-200">
              Something went wrong. Please try again.
            </p>
          </div>
        </div>
      )}
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
          disabled={isLoading}
          onClick={handleSaveChange}
          className={`w-full ${
            isDarkMode
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 shadow-blue-500/10"
              : "bg-gradient-to-r from-indigo-500 to-purple-500 shadow-blue-500/20"
          } text-white py-2 rounded-lg font-medium shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transform transition-all duration-300 hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:outline-none`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Pencil className="w-3 h-3" />
              <span>Save Changes</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

const ViewMode = ({ student, setIsEditing }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="space-y-6">
      <div
        className={` bg-[#1A1A1A] p-6 rounded-2xl mb-6 backdrop-blur-xl  ${
          isDarkMode ? "bg-[#1A1A1A]" : "bg-white"
        } shadow-lg`}
      >
        <div className="space-y-4">
          {[
            { label: "Name", value: student.name, icon: User },
            {
              label: "Date of Birth",
              value: new Date(student.age).toLocaleDateString(),
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
      </div>
    </div>
  );
};
export { EditMode, ViewMode };
