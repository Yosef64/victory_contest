import React, { useState, useEffect } from "react";
import { useTelegram } from "../hooks/useTelegram";
import { Contest, LeaderboardEntry } from "../types";
import { Trophy, Calendar, Award, Medal } from "lucide-react";
import { formatDistanceToNow, isAfter, parseISO } from "date-fns";
import {
  getAllContests,
  getLeaderboardByContest,
} from "../services/contestApi";
import ContestCard from "../components/ContestCard";
import NoContests from "../components/NoContest";
import { Link } from "react-router-dom";
import { ContestCardSkeleton } from "../components/ContestCardSkeleton";
import { BookOpenIcon, XMarkIcon } from "@heroicons/react/24/outline";
import WelcomeCarousel from "../components/WelcomeCarousell";

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

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <WelcomeCarousel user={user} />
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

        {loading ? (
          <ContestCardSkeleton />
        ) : (
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
        )}
        {contests.length === 0 && !loading && <NoContests type="active" />}
      </div>

      {/* Previous Contests */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Previous Contests
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {previousContests
              .sort((a, b) => {
                return (
                  new Date(b.start_time).getTime() -
                  new Date(a.start_time).getTime()
                );
              })
              .map((contest) => (
                <div
                  onClick={() => handleShowStandings(contest)}
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
                          {formatDistanceToNow(parseISO(contest.start_time))}{" "}
                          ago
                        </span>
                        <span>•</span>
                        <span>{contest.questions.length} questions</span>
                      </div>
                    </div>
                    <Link
                      to={`/contest-editorial?id=${contest.id}&title=${contest.title}`}
                      className={`flex rounded-full cursor-pointer items-center justify-center w-10 h-10 text-sm hover:text-[#00AB55] hover:bg-[#00AB5514] text-[#00AB55] font-bold`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="h-5 w-5 "
                        width="1.5em"
                        height="1.5em"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 256 256"
                      >
                        <g fill="currentColor">
                          <path
                            d="M152 128a24 24 0 1 1-24-24a24 24 0 0 1 24 24"
                            opacity=".2"
                          ></path>
                          <path d="M200 152a31.84 31.84 0 0 0-19.53 6.68l-23.11-18A31.65 31.65 0 0 0 160 128c0-.74 0-1.48-.08-2.21l13.23-4.41A32 32 0 1 0 168 104c0 .74 0 1.48.08 2.21l-13.23 4.41A32 32 0 0 0 128 96a32.6 32.6 0 0 0-5.27.44L115.89 81A32 32 0 1 0 96 88a32.6 32.6 0 0 0 5.27-.44l6.84 15.4a31.92 31.92 0 0 0-8.57 39.64l-25.71 22.84a32.06 32.06 0 1 0 10.63 12l25.71-22.84a31.91 31.91 0 0 0 37.36-1.24l23.11 18A31.65 31.65 0 0 0 168 184a32 32 0 1 0 32-32m0-64a16 16 0 1 1-16 16a16 16 0 0 1 16-16M80 56a16 16 0 1 1 16 16a16 16 0 0 1-16-16M56 208a16 16 0 1 1 16-16a16 16 0 0 1-16 16m56-80a16 16 0 1 1 16 16a16 16 0 0 1-16-16m88 72a16 16 0 1 1 16-16a16 16 0 0 1-16 16"></path>
                        </g>
                      </svg>
                    </Link>
                    <Link
                      onClick={() => {
                        handleShowStandings(contest);
                      }}
                      to=""
                      className={`flex rounded-full cursor-pointer items-center justify-center w-10 h-10 text-sm hover:text-[#00AB55] hover:bg-[#00AB5514] text-[#00AB55] font-bold`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        width="0.8em"
                        height="0.8em"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-5 w-5 "
                      >
                        <g fill="none">
                          <path
                            fill="currentColor"
                            d="M4 4.001h16v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"
                            opacity=".16"
                          ></path>
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 4H4v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M9 15L20 4m-5 0h5v5"
                          ></path>
                        </g>
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Previous Contest Modal */}
      {showPreviousModal && selectedPreviousContest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {/* --- MODAL CONTAINER: Softer shadow, slightly wider, and structured for scrolling --- */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-lg w-full flex flex-col max-h-[90vh]">
            {/* --- MODAL HEADER --- */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                    {selectedPreviousContest.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Final Standings
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* --- REFINED BUTTON: More subtle, professional style --- */}
                  <button className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700/70 px-3 py-2 rounded-lg transition-colors">
                    <BookOpenIcon className="h-5 w-5" />
                    Editorial
                  </button>
                  <button
                    onClick={() => setShowPreviousModal(false)}
                    className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    aria-label="Close"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* --- MODAL BODY / CONTENT AREA --- */}
            <div className="p-6 overflow-y-auto">
              {modalLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : previousContestLeaderboard.length > 0 ? (
                <div className="space-y-3">
                  {previousContestLeaderboard.map((entry) => {
                    const isCurrentUser = entry.user_id === user?.id;

                    return (
                      <div
                        key={entry.user_id}
                        className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                          isCurrentUser
                            ? "bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20"
                            : "bg-gray-50 dark:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          {getRankIcon(entry.rank)}
                          <div>
                            <div className="flex items-center">
                              <p
                                className={`font-semibold ${
                                  isCurrentUser
                                    ? "text-blue-800 dark:text-blue-300"
                                    : "text-gray-900 dark:text-gray-50"
                                }`}
                              >
                                {entry.user_name}
                              </p>
                              {isCurrentUser && (
                                <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {entry.correct_answers}/{entry.total_questions}{" "}
                              correct
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="font-bold text-lg text-gray-900 dark:text-gray-50">
                            {entry.score}%
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Rank #{entry.rank}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* --- PROPER EMPTY STATE --- */
                <div className="text-center py-16">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    {/* Replace with an appropriate icon, e.g., UsersIcon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-full w-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.318.239-.636.354-.961"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    No Participants Yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Check back later to see the final standings.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
