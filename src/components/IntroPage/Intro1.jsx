import React, { useState, useEffect } from "react";
import {
  Timer,
  Rocket,
  Sparkles,
  Users,
  Play,
  Trophy,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { getContest, getContestNoParticipants } from "@/lib/utils";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Loader from "../Loader";

function Intro1() {
  const [contest, setContest] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isContestStarted, setIsContestStarted] = useState(false);
  const [isContestEnded, setIsContestEnded] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { contest_id } = useParams();
  const [searchQueryParams] = useSearchParams();
  const tele_id = searchQueryParams.get("tele_id");
  const navigate = useNavigate();

  useEffect(() => {
    // Simulated API call - replace with your actual API endpoint
    const fetchContest = async () => {
      console.log("first effect");
      try {
        const contest = await getContest(contest_id);
        setContest(contest);
        setIsLoading(false);
      } catch (error) {
        setError("Something went wrong. Please try again later.");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContest();
    console.log(contest);
  }, [contest_id]);

  useEffect(() => {
    console.log("second effect");
    if (!contest?.start_time) return;
    console.log(contest);

    const calculateTimeLeft = () => {
      const now = new Date();
      // console.log(contest);
      const date = contest.date.split("T")[0];
      const [year, month, day] = date.split("-").map(Number);

      const contestDate = new Date(year, month - 1, day);
      const contestEndDate = new Date(year, month - 1, day);
      const start_time = contest.start_time.split(" ")[0];
      const end_time = contest.end_time.split(" ")[0];
      const [hours, minutes] = start_time.split(":").map(Number);
      const [endHours, endMinutes] = end_time.split(":").map(Number);
      contestDate.setHours(hours, minutes, 0, 0);
      contestEndDate.setHours(endHours, endMinutes, 0, 0);

      const difference = contestDate.getTime() - now.getTime();
      const endDifference = contestEndDate.getTime() - now.getTime();

      if (endDifference <= 0) {
        setIsContestEnded(true);
      }
      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    const timer = setInterval(() => {
      try {
        const newTimeLeft = calculateTimeLeft();
        setTimeLeft(newTimeLeft);

        if (
          newTimeLeft.hours === 0 &&
          newTimeLeft.minutes === 0 &&
          newTimeLeft.seconds === 0
        ) {
          clearInterval(timer);
          setIsContestStarted(true);
        }
      } catch (error) {
        console.log(error);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [contest]);

  const formatTime = (value) => value.toString().padStart(2, "0");
  const handleRegister = async () => {
    try {
      await registerStudentForContest(tele_id, contest_id);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return (
      <div className="min-h-screen bg-[#162233] flex items-center justify-center">
        <div className="text-white text-xl">{error}</div>
      </div>
    );
  }
  if (Object.keys(contest).length == 0) {
    return (
      <div className="min-h-screen bg-[#162233] flex items-center justify-center">
        <div className="text-white text-xl">No contest found</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#040c15] flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(255, 200, 124, 0.03) 0%, transparent 20%),
          radial-gradient(circle at 90% 80%, rgba(124, 200, 255, 0.03) 0%, transparent 20%),
          radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 100%)
        `,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[40vw] h-[40vw] bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl animate-float"
            style={{
              top: `${20 + i * 30}%`,
              left: `${10 + i * 30}%`,
              animationDelay: `${i * 2}s`,
              opacity: 0.1,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-xl w-full">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-emerald-500/10 backdrop-blur-lg rounded-full p-3 shadow-lg">
            {isContestStarted ? (
              <Trophy className="text-yellow-400 w-8 h-8 animate-bounce" />
            ) : (
              <Rocket className="text-emerald-400 w-8 h-8 animate-pulse" />
            )}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/10">
          <div className="flex flex-col items-center gap-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-3 tracking-tight">
                {contest.title}
              </h1>
              <p className="text-emerald-200 text-lg mb-2">
                {contest.description}
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-emerald-200">
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  {contest.grade}
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {contest.subject}
                </div>
              </div>
            </div>

            {!isContestStarted && (
              <div className="grid grid-cols-3 gap-6 w-full">
                {[
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Minutes" },
                  { value: timeLeft.seconds, label: "Seconds" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10 text-center group hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="text-4xl font-mono font-bold text-white mb-1 group-hover:scale-105 transition-transform">
                      {formatTime(item.value)}
                    </div>
                    <div className="text-emerald-200 text-sm">{item.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="w-full space-y-4">
              <Participants />
              {isContestStarted ? (
                <button
                  disabled={isContestEnded}
                  onClick={() =>
                    navigate(
                      `/quizPage?tele_id=${tele_id}&contest_id=${contest_id}`,
                      {
                        state: { contest: contest },
                      }
                    )
                  }
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-orange-500/20"
                >
                  <Play className="group-hover:translate-x-1 transition-transform duration-300" />
                  {isContestEnded ? "Contest has Ended" : "Join Contest Now"}
                </button>
              ) : (
                <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 px-6 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-emerald-500/20">
                  <Timer className="group-hover:rotate-12 transition-transform duration-300" />
                  Register Now
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent blur-sm" />
      </div>
    </div>
  );
}
function Participants() {
  const { contest_id } = useParams();
  const [participants, setParticipants] = useState(0);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await getContestNoParticipants(contest_id);
        setParticipants(res);
      } catch (error) {
        console.log(error);
      }
    };

    fetchParticipants();
  }, [contest_id]);
  return (
    <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
      <Users className="text-emerald-400" />
      <div className="flex-1">
        <div className="text-white font-semibold">Participants</div>
        <div className="text-emerald-200 text-sm">
          {participants} registered
        </div>
      </div>
      <Sparkles className="text-yellow-300 animate-pulse" />
    </div>
  );
}
export default Intro1;
