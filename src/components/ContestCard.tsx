import { useEffect, useLayoutEffect, useRef, useLayoutEffect, useRef, useState } from "react";
import { Contest } from "../types";
import { isAfter, parseISO } from "date-fns";
import {
  CheckCircle,
  ChevronRight,
  Play,
  PlayCircle,
  Star,
  Timer,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTelegram } from "../hooks/useTelegram";
import { isUserRegistered } from "../services/contestApi";

const ExpandableDescription = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // useLayoutEffect runs synchronously after all DOM mutations.
  // This is perfect for measuring DOM elements right after they render.
  useLayoutEffect(() => {
    const element = textRef.current;
    if (element) {
      // Check if the content's full height is greater than its visible height.
      // This is a reliable way to detect if text is being clamped.
      if (element.scrollHeight > element.clientHeight) {
        setIsOverflowing(true);
      }
    }
  }, [text]);

  return (
    <div className="mb-4">
      <p
        ref={textRef}
        className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${
          !isExpanded ? "line-clamp-1" : ""
        }`}
      >
        {text}
      </p>
      {/* Only show the button if the text is actually overflowing */}
      {isOverflowing && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 dark:text-blue-400 text-xs font-semibold mt-1 hover:underline focus:outline-none"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default function ContestCard({
  contest,
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
              {contest.type === "free" ? (
                <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/50 dark:text-green-200">
                  <CheckCircle className="mr-1.5 h-4 w-4 fill-current text-green-600 dark:text-green-400" />
                  Free
                </div>
              ) : (
                <div className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
                  <Star className="mr-1.5 h-4 w-4 fill-current text-yellow-600 dark:text-yellow-400" />
                  Premium
                </div>
              )}
            </div>
            <ExpandableDescription text={contest.description} />
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
            timeLeft?.includes("Contest Started") && isRegistered
              ? `/contest?con=${contest.id}`
              : isRegistered
              ? "#"
              : `/registration?con=${contest.id}`
          }
          onClick={() => {
            handleContestClick();
            // if (isRegistered) e.preventDefault();
          }}
          className={`w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
            timeLeft?.includes("Contest Started") && isRegistered
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
              : isRegistered
              ? "bg-green-500 text-white cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          {checkingRegistration ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
              {"Checking..."}
            </span>
          ) : timeLeft?.includes("Contest Started") && isRegistered ? (
            <>
              <PlayCircle className="w-5 h-5 mr-2" />
              Join Contest Now
            </>
          ) : isRegistered ? (
            <>
              <PlayCircle className="w-5 h-5 mr-2 text-gray-200" />
              Registered
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
