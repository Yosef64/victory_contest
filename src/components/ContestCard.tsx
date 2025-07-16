import React, { useEffect, useState } from "react";
import { Contest } from "../types";
import { isAfter, parseISO } from "date-fns";
import { ChevronRight, Play, PlayCircle, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { useTelegram } from "../hooks/useTelegram";
import { isUserRegistered } from "../services/contestApi";

export default function ContestCard({
  contest,
  isStartingSoon,
}: {
  contest: Contest;
  isStartingSoon: boolean;
}) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const { hapticFeedback, user } = useTelegram();
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [checkingRegistration, setCheckingRegistration] =
    useState<boolean>(true);

  useEffect(() => {
    let ignore = false;
    const checkRegistration = async () => {
      if (user && contest.id) {
        setCheckingRegistration(true);
        try {
          const registered = await isUserRegistered(
            contest.id,
            user.id.toString()
          );
          if (!ignore) setIsRegistered(registered);
        } catch (e) {
          if (!ignore) setIsRegistered(false);
        } finally {
          if (!ignore) setCheckingRegistration(false);
        }
      } else {
        setIsRegistered(false);
        setCheckingRegistration(false);
      }
    };
    checkRegistration();
    return () => {
      ignore = true;
    };
  }, [contest.id, user?.id]);

  useEffect(() => {
    const updateCountdowns = () => {
      let newTimeLeft = "";

      const startTime = parseISO(contest.start_time);
      const now = new Date();

      if (isAfter(startTime, now)) {
        const distance = startTime.getTime() - now.getTime();
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (days > 0) {
          newTimeLeft = `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
          newTimeLeft = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          newTimeLeft = `${minutes}m ${seconds}s`;
        }
      } else {
        newTimeLeft = "Contest Started";
      }
      setTimeLeft(newTimeLeft);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [contest?.start_time]);

  const handleContestClick = () => {
    hapticFeedback("impact", "light");
  };

  return (
    <div
      key={contest.id}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between space-x-2 mb-2">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {contest.title}
              </h3>
              {isStartingSoon && (
                <span className="px-2 py-1 text-green-800 bg-green-400 dark:bg-green-900/20 dark:text-green-400 text-xs font-medium rounded-full">
                  Active
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              {contest.description}
            </p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-4 border border-blue-100 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Timer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                {timeLeft?.includes("Contest Started")
                  ? "Contest Started"
                  : "Starts in"}
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {timeLeft || "Loading..."}
              </div>
              <div className="text-xs text-blue-500 dark:text-blue-400">
                {new Date(contest.start_time).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={
            timeLeft?.includes("Contest Started")
              ? `/contest?con=${contest.id}`
              : isRegistered
              ? "#"
              : `/registration?con=${contest.id}`
          }
          onClick={(e) => {
            handleContestClick();
            if (isRegistered) e.preventDefault();
          }}
          className={`w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
            isRegistered
              ? "bg-green-500 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
          }`}
        >
          {checkingRegistration ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
              {"Checking..."}
            </span>
          ) : isRegistered ? (
            <>
              <PlayCircle className="w-5 h-5 mr-2 text-gray-200" />
              Registered
            </>
          ) : timeLeft?.includes("Contest Started") ? (
            <>
              <PlayCircle className="w-5 h-5 mr-2" />
              Join Contest Now
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Register Now
            </>
          )}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}
