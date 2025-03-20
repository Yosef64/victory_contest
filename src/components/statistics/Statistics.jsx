import React, { useEffect, useState } from "react";
import { BookOpen, Home, User, ChevronDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { fetchUserMissedData } from "@/lib/utils";
import { NavLink, useParams } from "react-router-dom";
import Loader from "../Loader";
import { Header, QuickStats } from "./StatComps";

const data = {
  missed_questions: {
    Grade_8: {
      Geography: {
        Chapter_2: 1,
      },
    },
    Grade_11: {
      English: {
        Chapter_4: 1,
      },
    },
    Grade_9: {
      Biology: {
        Chapter_5: 1,
      },
      Chemistry: {
        Chapter_1: 1,
      },
    },
    Grade_10: {
      Physics: {
        Chapter_1: 2,
      },
      Math: {
        Chapter_3: 1,
      },
    },
    Grade_12: {
      Biology: {
        Chapter_1: 1,
      },
      English: {
        Chapter_6: 1,
      },
    },
  },
};

const subjectColors = {
  Geography: "#22C55E",
  English: "#3B82F6",
  Biology: "#8B5CF6",
  Chemistry: "#EC4899",
  Physics: "#F97316",
  Math: "#6366F1",
  Aptitude: "#EAB308",
  History: "#14B8A6",
};

function Statistics() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [timePeriod, setTimePeriod] = useState("current");
  const [expandedCards, setExpandedCards] = useState({});
  const { id } = useParams();
  const [data, setData] = useState({});
  const [status, setStatus] = useState("pending");
  useEffect(() => {
    const fetchData = async () => {
      setStatus("pending");
      try {
        const res = await fetchUserMissedData(timePeriod, id);
        setData(res);
        setStatus("success");
      } catch (error) {
        setStatus("error");
      }
    };
    fetchData();
  }, [timePeriod, id]);
  if (status == "pending") {
    return <Loader />;
  }
  if (status === "error") {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p>Something went wrong!</p>
      </div>
    );
  }

  const subjectData = Object.entries(data.missed_questions).reduce(
    (acc, [grade, subjects]) => {
      Object.entries(subjects).forEach(([subject, chapters]) => {
        if (!acc[subject]) {
          acc[subject] = {
            missed: 0,
            grades: {},
            chapters: {},
            color: subjectColors[subject],
          };
        }
        acc[subject].missed += Object.values(chapters)[0];
        if (!acc[subject].grades[grade]) {
          acc[subject].grades[grade] = {
            missed: Object.values(chapters)[0],
            chapters: chapters,
          };
        }
      });
      return acc;
    },
    {}
  );

  const totalMissedQuestions = Object.values(subjectData).reduce(
    (acc, { missed }) => acc + missed,
    0
  );

  const chartData = Object.entries(subjectData)
    .filter(([subject]) => !selectedSubject || subject === selectedSubject)
    .map(([subject, data]) => ({
      name: subject,
      missed: data.missed,
      color: data.color,
    }));

  const toggleCardExpansion = (subject) => {
    setExpandedCards((prev) => ({
      ...prev,
      [subject]: !prev[subject],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] text-white p-4 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <Header />

        {/* Quick Stats */}
        <QuickStats />

        {/* Time Period Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {["current", "month", "week"].map((period) => (
            <button
              key={period}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                timePeriod === period
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                  : "bg-[#1A1A1A] text-gray-400 hover:bg-[#252525]"
              }`}
              onClick={() => setTimePeriod(period)}
            >
              {period === "current"
                ? "All Time"
                : `This ${period.charAt(0).toUpperCase() + period.slice(1)}`}
            </button>
          ))}
        </div>

        {/* Subject Selection */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-custom">
          <button
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              !selectedSubject
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                : "bg-[#1A1A1A] text-gray-400 hover:bg-[#252525]"
            }`}
            onClick={() => setSelectedSubject(null)}
          >
            All Subjects
          </button>
          {Object.entries(subjectData).map(([subject, { color }]) => (
            <button
              key={subject}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all`}
              style={{
                backgroundColor:
                  selectedSubject === subject ? color : "#1A1A1A",
                color: selectedSubject === subject ? "white" : "#9CA3AF",
              }}
              onClick={() => setSelectedSubject(subject)}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Main Stats Card */}
        <div className="bg-[#1A1A1A] p-6 rounded-2xl mb-6 backdrop-blur-xl bg-opacity-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Missed Questions</h2>
              <p className="text-sm text-gray-400">
                {timePeriod === "current" ? "All Time" : `This ${timePeriod}`}
              </p>
            </div>
            <div
              className="text-3xl font-bold"
              style={{
                color: selectedSubject
                  ? subjectColors[selectedSubject]
                  : "#6366F1",
              }}
            >
              {status === "success" && selectedSubject
                ? subjectData[selectedSubject].missed
                : totalMissedQuestions}
            </div>
          </div>
          <div className="h-[200px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#333"
                  opacity={0.5}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  axisLine={{ stroke: "#333" }}
                  tickLine={{ stroke: "#333" }}
                />
                <YAxis
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  axisLine={{ stroke: "#333" }}
                  tickLine={{ stroke: "#333" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                  contentStyle={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#9CA3AF" }}
                />
                <Bar dataKey="missed" radius={[6, 6, 0, 0]} fill={"#6366F1"}>
                  {chartData.map((entry) => (
                    <Cell key={entry.missed} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Cards with Chapter Details */}
        <div className="grid grid-cols-1 gap-4 mb-24">
          {Object.entries(subjectData)
            .filter(
              ([subject]) => !selectedSubject || subject === selectedSubject
            )
            .map(([subject, { missed, color, grades }]) => (
              <div
                key={subject}
                className="bg-[#1A1A1A] p-5 rounded-2xl backdrop-blur-xl bg-opacity-50 border border-gray-800"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <BookOpen className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium" style={{ color }}>
                      {subject}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {Object.keys(grades).length} grades
                    </p>
                  </div>
                  <button
                    onClick={() => toggleCardExpansion(subject)}
                    className="p-1 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedCards[subject] ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                <div
                  className={`space-y-3  transition-all duration-500 ease-in-out ${
                    expandedCards[subject] ? "block" : "hidden"
                  }`}
                >
                  {Object.entries(grades).map(([grade, { chapters }]) => (
                    <div key={grade} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">
                          {grade.replace("_", " ")}
                        </span>
                      </div>
                      {Object.entries(chapters).map(([chapter, count]) => (
                        <div
                          key={chapter}
                          className="flex justify-between text-sm pl-4"
                        >
                          <span className="text-gray-500">
                            {chapter.replace("_", " ")}
                          </span>
                          <span className="font-medium" style={{ color }}>
                            {count} missed
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Always visible summary */}
                <div
                  className={`mt-3 pt-3 border-t transition-transform border-gray-800 ${
                    expandedCards[subject] ? "hidden" : "block"
                  }`}
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Missed</span>
                    <span className="font-medium" style={{ color }}>
                      {missed} questions
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A]/90 backdrop-blur-lg border-t border-gray-800">
          <div className="max-w-md mx-auto flex items-center justify-evenly p-4">
            {[
              { icon: Home, label: "Statistics", active: true },

              { icon: User, label: "Profile" },
            ].map(({ icon: Icon, label, active }) => (
              <NavLink to={`/${label.toLowerCase()}/${id}`}>
                <button
                  key={label}
                  className={`flex flex-col items-center gap-1 transition-all ${
                    active
                      ? "text-indigo-500"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs">{label}</span>
                </button>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
