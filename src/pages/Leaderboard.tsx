import React, { useState, useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { LeaderboardEntry } from '../types';
import { Trophy, Medal, Award, Clock, Target } from 'lucide-react';
import api from '../services/api';

const Leaderboard: React.FC = () => {
  const { user } = useTelegram();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState<'today' | 'week' | 'month' | 'all'>('week');

  useEffect(() => {
    setLoading(true);
    api
      .get(`/leaderboard?timeFrame=${timeFrame}`)
      .then((res) => {
        setLeaderboard(res.data.leaderboard || []);
        setLoading(false);
      })
      .catch(() => {
        setLeaderboard([]);
        setLoading(false);
      });
  }, [timeFrame, user]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-bold text-gray-600 dark:text-gray-400">{rank}</div>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-white dark:bg-gray-800';
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
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Leaderboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          See how you rank against other contestants
        </p>
      </div>

      {/* Time Frame Filter */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {(['today', 'week', 'month', 'all'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setTimeFrame(period)}
            className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition-colors ${timeFrame === period
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            {period === 'all' ? 'All Time' : `This ${period}`}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Top Performers
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {leaderboard.slice(0, 3).map((entry, _) => (
            <div key={entry.user_id} className="text-center">
              <div className={`p-4 rounded-xl shadow-sm ${getRankColor(entry.rank)} ${entry.rank <= 3 ? 'text-white' : 'text-gray-800 dark:text-white'
                }`}>
                <div className="flex justify-center mb-2">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="text-lg font-bold">{entry.user_name}</div>
                <div className="text-2xl font-bold">{entry.score}%</div>
                <div className="text-sm opacity-90">
                  {entry.correct_answers}/{entry.total_questions}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Full Rankings
        </h2>
        <div className="space-y-2">
          {leaderboard.map((entry) => {
            const isCurrentUser = entry.user_id === user?.id;

            return (
              <div
                key={entry.user_id}
                className={`p-4 rounded-xl shadow-sm transition-all duration-200 ${isCurrentUser
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getRankIcon(entry.rank)}
                    <div>
                      <div className={`font-semibold ${isCurrentUser
                        ? 'text-blue-800 dark:text-blue-300'
                        : 'text-gray-800 dark:text-white'
                        }`}>
                        {entry.user_name}
                        {isCurrentUser && <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">(You)</span>}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Rank #{entry.rank}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <Target className="w-4 h-4 mr-1" />
                        <span className="font-bold">{entry.score}%</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {entry.correct_answers}/{entry.total_questions}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center text-blue-600 dark:text-blue-400">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="font-bold">{formatTime(entry.time_taken)}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Time
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Your Performance Summary */}
      {user && (
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            Your Performance
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                #{leaderboard.find(entry => entry.user_id === user.id)?.rank || 'N/A'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Rank</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {leaderboard.find(entry => entry.user_id === user.id)?.score || 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Best Score</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;