import React, { useEffect, useState } from "react";
import { ChevronLeft, Trophy, Crown, Flame } from "lucide-react";
import { useLocation } from "react-router-dom";
import Loader from "../Loader";
import { useQuery } from "@tanstack/react-query";
import ErrorComponent from "../Error";
import { getSummissionByRange } from "@/lib/utils";

function TopThree({ rank, image, name, score, total }) {
  return (
    <>
      <img src={image || "./profile.jpg"} className={`pic${rank}`} alt="" />
      <span>{rank}</span>
      <article>
        <p>{name}</p>
        <p>
          {score}/{total}
        </p>
      </article>
    </>
  );
}

// const users = [
//   {
//     id: 1,
//     name: "Jane Cooper",
//     achievements: 54,
//     avatar:
//       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
//     medal: "gold",
//   },
//   {
//     id: 2,
//     name: "Marvin McKinney",
//     achievements: 46,
//     avatar:
//       "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
//     medal: "silver",
//   },
//   {
//     id: 3,
//     name: "Bessie Cooper",
//     achievements: 43,
//     avatar:
//       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
//     medal: "bronze",
//   },
//   {
//     id: 4,
//     name: "Robert Fox",
//     achievements: 42,
//     rank: 4,
//     avatar:
//       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
//   },
//   {
//     id: 5,
//     name: "Courtney Henry",
//     achievements: 32,
//     rank: 5,
//     avatar:
//       "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
//   },
//   {
//     id: 6,
//     name: "Dianne Russell",
//     achievements: 30,
//     rank: 6,
//     avatar:
//       "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop",
//   },
//   {
//     id: 7,
//     name: "Cameron Williamson",
//     achievements: 28,
//     rank: 7,
//     avatar:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
//   },
//   {
//     id: 8,
//     name: "Wenji Tsu",
//     achievements: 4,
//     rank: 29,
//     avatar:
//       "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
//   },
// ];

export function Leaderboard1() {
  const [when, setWhen] = useState("today");
  const [submissions, setSubmissions] = useState([]);
  const [status, setStatus] = useState("pending");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("tele_id");
  const contest_id = queryParams.get("contest_id");

  useEffect(() => {
    setStatus("pending");
    async function fetchSubmissions() {
      try {
        const res = await getSummissionByRange(when, contest_id);
        setSubmissions(res);
        setStatus("success");
      } catch (error) {
        setStatus("error");
        console.log(error);
      }
    }
    fetchSubmissions();
  }, [when]);
  console.log(submissions);
  return (
    <div className="h-screen flex bg-white dark:bg-black text-gray-900 dark:text-white pb-24">
      <div className="max-w-md flex flex-col mx-auto pt-8 px-4 flex-1">
        {/* Header */}
        <div className="flex items-center mb-8">
          <h1 className="text-xl font-semibold flex-1 text-center mr-8">
            Leaderboard
          </h1>
        </div>

        {/* Tabs */}
        <div className="bg-gray-100/80 dark:bg-zinc-800/50 backdrop-blur-sm rounded-full p-1 flex mb-8 shadow-lg">
          <button
            onClick={() => setWhen("today")}
            className={`flex-1 py-2 px-4 text-sm rounded-full transition-colors ${
              when === "today"
                ? "bg-dark font-semibold dark:bg-white text-gray-900 dark:text-black shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {contest_id ? "Current" : "Today"}
          </button>
          <button
            onClick={() => setWhen("week")}
            className={`flex-1  py-2 px-4 text-sm rounded-full transition-colors ${
              when === "week"
                ? "bg-dark font-semibold dark:bg-white text-gray-900 dark:text-black shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setWhen("month")}
            className={`flex-1 py-2 px-4 text-sm rounded-full transition-colors ${
              when === "month"
                ? "bg-dark dark:bg-white font-semibold text-gray-900 dark:text-black shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Month
          </button>
        </div>

        {/* Leaderboard List / Loader */}
        <div className="flex-1 flex ">
          {status == "success" ? (
            <div className="space-y-3 w-full">
              {submissions
                .map((submission, index) => ({
                  id: submission.student.student_id,
                  name: submission.student.name,
                  achievements: submission.score,
                  rank: index + 1,
                  avatar: submission.student.imgurl,
                  point: submission.score,
                }))
                .map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 rounded-2xl transition-colors hover:bg-gray-50 dark:hover:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/50"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-zinc-700"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium flex items-center gap-2">
                        {user.name}
                        {user.rank === 1 && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Trophy className="w-4 h-4 mr-1.5 text-yellow-500" />
                        {user.point} points
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {user.rank === 1 && <span className="text-2xl">🥇</span>}
                      {user.rank === 2 && <span className="text-2xl">🥈</span>}
                      {user.rank === 3 && <span className="text-2xl">🥉</span>}
                      {user.rank && (
                        <span className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-sm">
                          #{user.rank}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : status === "pending" ? (
            <div className="relative flex-1 flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <ErrorComponent />
          )}
        </div>
      </div>

      {/* Fixed Bottom User Stats */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-zinc-800">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser.avatar}
              alt="Your avatar"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500"
            />
            <div className="flex-1">
              <h3 className="font-medium flex items-center gap-2">
                {currentUser.name}
                <span className="bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full text-xs text-emerald-600 dark:text-emerald-500">
                  #{currentUser.rank}
                </span>
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Trophy className="w-4 h-4 mr-1.5 text-yellow-500" />
                {currentUser.achievements} achievements
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <Flame className="w-5 h-5 text-orange-500 mb-1" />
                <span className="text-sm font-medium">
                  {currentUser.streak}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Streak
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const currentUser = {
  name: "You",
  rank: 15,
  achievements: 18,
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
  streak: 7,
};
function FixedUser() {
  const [currentUser, setCurrentUser] = useState({});
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-zinc-800">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center space-x-4">
          <img
            src={currentUser.avatar}
            alt="Your avatar"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500"
          />
          <div className="flex-1">
            <h3 className="font-medium flex items-center gap-2">
              {currentUser.name}
              <span className="bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full text-xs text-emerald-600 dark:text-emerald-500">
                #{currentUser.rank}
              </span>
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Trophy className="w-4 h-4 mr-1.5 text-yellow-500" />
              {currentUser.achievements} achievements
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <Flame className="w-5 h-5 text-orange-500 mb-1" />
              <span className="text-sm font-medium">{currentUser.streak}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Streak
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TopThree;
