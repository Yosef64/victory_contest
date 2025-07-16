import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTelegram } from "../hooks/useTelegram";
import { Contest, LeaderboardEntry } from "../types";
import {
  Play,
  Trophy,
  Calendar,
  Award,
  ChevronRight,
  Medal,
  Timer,
  PlayCircle,
} from "lucide-react";
import { formatDistanceToNow, isAfter, parseISO } from "date-fns";
import {
  getAllContests,
  getLeaderboardByContest,
} from "../services/contestApi";
import ContestCard from "../components/ContestCard";
import NoContests from "../components/NoContest";
import { Button } from "../components/ui/button";

const Home: React.FC = () => {
  const { user, hapticFeedback } = useTelegram();
  const [contests, setContests] = useState<Contest[]>([]);
  const [previousContests, setPreviousContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPreviousContest, setSelectedPreviousContest] =
    useState<Contest | null>(null);
  const [previousContestLeaderboard, setPreviousContestLeaderboard] = useState<
    LeaderboardEntry[]
  >([]);
  const [showPreviousModal, setShowPreviousModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true);
      try {
        const contests = await getAllContests();
        // Split contests into active and previous based on end_time
        const now = new Date();
        const active: Contest[] = [];
        const previous: Contest[] = [];
        contests.forEach((contest) => {
          if (new Date(contest.end_time) > now) {
            active.push(contest);
          } else {
            previous.push(contest);
          }
        });
        setContests(active);
        setPreviousContests(previous);
      } catch (e) {
        // handle error
      }
      setLoading(false);
    };
    fetchContests();
  }, []);

  const handleShowStandings = async (contest: Contest) => {
    hapticFeedback("selection");
    setSelectedPreviousContest(contest);
    setShowPreviousModal(true);
    setModalLoading(true);
    try {
      const leaderboard = await getLeaderboardByContest(contest.id);
      setPreviousContestLeaderboard(leaderboard);
    } catch (e) {
      setPreviousContestLeaderboard([]);
    } finally {
      setModalLoading(false);
    }
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
        </div>
      </div>
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
            const startTime = parseISO(contest.start_time);
            const now = new Date();
            const isStartingSoon =
              isAfter(startTime, now) &&
              startTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000;

            return (
              <ContestCard
                contest={contest}
                key={contest.id}
                isStartingSoon={isStartingSoon}
              />
            );
          })}
        </div>
        {contests.length === 0 && <NoContests type="active" />}
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
                      {formatDistanceToNow(parseISO(contest.start_time))} ago
                    </span>
                    <span>•</span>
                    <span>{contest.questions.length} questions</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleShowStandings(contest)}
                  className="flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  Standings
                </Button>
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

            {modalLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
