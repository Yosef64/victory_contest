import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTelegram } from "../hooks/useTelegram";
import { Contest, LeaderboardEntry } from "../types";
import {
  Play,
  Trophy,
  BarChart3,
  Clock,
  Users,
  Calendar,
  Award,
  ChevronRight,
  Star,
  Medal,
  Timer,
  PlayCircle,
  Eye,
} from "lucide-react";
import { formatDistanceToNow, isAfter, isBefore, parseISO } from "date-fns";

const Home: React.FC = () => {
  const { user, hapticFeedback } = useTelegram();
  const [contests, setContests] = useState<Contest[]>([]);
  const [previousContests, setPreviousContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{ [key: number]: string }>({});
  const [selectedPreviousContest, setSelectedPreviousContest] =
    useState<Contest | null>(null);
  const [previousContestLeaderboard, setPreviousContestLeaderboard] = useState<
    LeaderboardEntry[]
  >([]);
  const [showPreviousModal, setShowPreviousModal] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const now = new Date();
      const activeContests: Contest[] = [
        {
          id: 1,
          title: "Mathematics Championship 2024",
          description:
            "Advanced mathematical concepts including calculus, algebra, and geometry",
          start_date: new Date(
            now.getTime() + 2 * 60 * 60 * 1000
          ).toISOString(), // 2 hours from now
          end_date: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
          total_questions: 50,
          duration_minutes: 90,
          is_active: false,
        },
        {
          id: 2,
          title: "Science Quiz Championship",
          description:
            "Comprehensive science test covering physics, chemistry, and biology",
          start_date: new Date(
            now.getTime() + 24 * 60 * 60 * 1000
          ).toISOString(), // 1 day from now
          end_date: new Date(now.getTime() + 26 * 60 * 60 * 1000).toISOString(),
          total_questions: 40,
          duration_minutes: 60,
          is_active: false,
        },
      ];

      const pastContests: Contest[] = [
        {
          id: 3,
          title: "English Literature Contest",
          description: "Classic and modern literature analysis",
          start_date: new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 7 days ago
          end_date: new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
          ).toISOString(),
          total_questions: 35,
          duration_minutes: 75,
          is_active: false,
        },
        {
          id: 4,
          title: "History Challenge",
          description: "World history from ancient to modern times",
          start_date: new Date(
            now.getTime() - 14 * 24 * 60 * 60 * 1000
          ).toISOString(), // 14 days ago
          end_date: new Date(
            now.getTime() - 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
          ).toISOString(),
          total_questions: 45,
          duration_minutes: 80,
          is_active: false,
        },
      ];

      setContests(activeContests);
      setPreviousContests(pastContests);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const updateCountdowns = () => {
      const newTimeLeft: { [key: number]: string } = {};

      contests.forEach((contest) => {
        const startTime = parseISO(contest.start_date);
        const now = new Date();

        if (isAfter(startTime, now)) {
          const distance = startTime.getTime() - now.getTime();
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          if (days > 0) {
            newTimeLeft[contest.id] = `${days}d ${hours}h ${minutes}m`;
          } else if (hours > 0) {
            newTimeLeft[contest.id] = `${hours}h ${minutes}m ${seconds}s`;
          } else {
            newTimeLeft[contest.id] = `${minutes}m ${seconds}s`;
          }
        } else {
          newTimeLeft[contest.id] = "Contest Started";
        }
      });

      setTimeLeft(newTimeLeft);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [contests]);

  const handleContestClick = () => {
    hapticFeedback("impact", "light");
  };

  const handleShowStandings = (contest: Contest) => {
    hapticFeedback("selection");
    setSelectedPreviousContest(contest);

    // Simulate API call for leaderboard
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        user_id: 1,
        user_name: "Alice Johnson",
        score: 95,
        correct_answers: 33,
        total_questions: contest.total_questions,
        time_taken: 4200,
        rank: 1,
      },
      {
        user_id: 2,
        user_name: "Bob Smith",
        score: 88,
        correct_answers: 31,
        total_questions: contest.total_questions,
        time_taken: 3800,
        rank: 2,
      },
      {
        user_id: 3,
        user_name: "Charlie Brown",
        score: 82,
        correct_answers: 29,
        total_questions: contest.total_questions,
        time_taken: 4500,
        rank: 3,
      },
      {
        user_id: user?.id || 4,
        user_name: user?.first_name || "You",
        score: 78,
        correct_answers: 27,
        total_questions: contest.total_questions,
        time_taken: 4100,
        rank: 4,
      },
    ];

    setPreviousContestLeaderboard(mockLeaderboard);
    setShowPreviousModal(true);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <div className="w-5 h-5 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-xs font-bold text-gray-600 dark:text-gray-400">
            {rank}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.first_name || "Student"}! 👋
            </h1>
            <p className="text-blue-100 opacity-90">
              Ready to challenge yourself with today's contests?
            </p>
          </div>
          {/* <div className="text-right">
            <div className="text-sm text-blue-200 opacity-75">Current Streak</div>
            <div className="text-2xl font-bold">7 🔥</div>
          </div> */}
        </div>

        {/* Quick Achievement
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-800" />
            </div>
            <div>
              <div className="font-semibold">Achievement Unlocked!</div>
              <div className="text-sm text-blue-100 opacity-90">Speed Demon - Answer 10 questions in under 30 seconds</div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Performance Overview
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <div className="flex items-center text-green-500">
              <TrendingUp size={16} />
              <span className="text-xs font-medium ml-1">+2</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">12</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Contests Won</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-green-500" />
            <div className="flex items-center text-green-500">
              <TrendingUp size={16} />
              <span className="text-xs font-medium ml-1">+5%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">85%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="flex items-center text-green-500">
              <TrendingUp size={16} />
              <span className="text-xs font-medium ml-1">↑3</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">#15</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Global Rank</p>
        </div>
      </div> */}

      {/* Upcoming Contests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Upcoming Contests
          </h2>
          <div className="flex items-center text-blue-600 dark:text-blue-400">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">
              {contests.length} Available
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {contests.map((contest) => {
            const startTime = parseISO(contest.start_date);
            const now = new Date();
            const isStartingSoon =
              isAfter(startTime, now) &&
              startTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000;

            return (
              <div
                key={contest.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                          {contest.title}
                        </h3>
                        {isStartingSoon && (
                          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 text-xs font-medium rounded-full animate-pulse">
                            Starting Soon
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
                          {timeLeft[contest.id]?.includes("Contest Started")
                            ? "Contest Started"
                            : "Starts in"}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {timeLeft[contest.id] || "Loading..."}
                        </div>
                        <div className="text-xs text-blue-500 dark:text-blue-400">
                          {new Date(contest.start_date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contest Details */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <Clock className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-gray-800 dark:text-white">
                        {contest.duration_minutes} min
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Duration
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <BarChart3 className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-gray-800 dark:text-white">
                        {contest.total_questions}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Questions
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-gray-800 dark:text-white">
                        1,247
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Registered
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={
                      timeLeft[contest.id]?.includes("Contest Started")
                        ? `/contest?id=${contest.id}`
                        : "/registration"
                    }
                    onClick={handleContestClick}
                    className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    {timeLeft[contest.id]?.includes("Contest Started") ? (
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
          })}
        </div>
      </div>

      {/* Previous Contests */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Previous Contests
        </h2>
        <div className="space-y-3">
          {previousContests.map((contest) => (
            <div
              key={contest.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                    {contest.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      Completed{" "}
                      {formatDistanceToNow(parseISO(contest.start_date))} ago
                    </span>
                    <span>•</span>
                    <span>{contest.total_questions} questions</span>
                  </div>
                </div>
                <button
                  onClick={() => handleShowStandings(contest)}
                  className="flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Show Standings
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Contest Modal */}
      {showPreviousModal && selectedPreviousContest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {selectedPreviousContest.title}
                </h3>
                <button
                  onClick={() => setShowPreviousModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="text-gray-500 text-xl">×</span>
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Final Standings
              </p>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-3">
                {previousContestLeaderboard.map((entry) => {
                  const isCurrentUser = entry.user_id === user?.id;

                  return (
                    <div
                      key={entry.user_id}
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        isCurrentUser
                          ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                          : "bg-gray-50 dark:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {getRankIcon(entry.rank)}
                        <div>
                          <div
                            className={`font-semibold ${
                              isCurrentUser
                                ? "text-blue-800 dark:text-blue-300"
                                : "text-gray-800 dark:text-white"
                            }`}
                          >
                            {entry.user_name}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                                (You)
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {entry.correct_answers}/{entry.total_questions}{" "}
                            correct
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800 dark:text-white">
                          {entry.score}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          #{entry.rank}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
