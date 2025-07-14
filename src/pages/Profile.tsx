import React, { useState } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { 
  User, Settings, Award, BookOpen, Target, Clock, Edit2, Check, X,
  Trophy, Medal, Star, Zap, Crown, Shield, Flame, Brain,
  TrendingUp, Calendar, ChevronRight, Lock
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user, hapticFeedback } = useTelegram();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    displayName: user?.first_name || '',
    grade: '11th Grade',
    subjects: ['Mathematics', 'Science', 'English']
  });

  const userStats = {
    totalContests: 12,
    totalQuestions: 450,
    correctAnswers: 378,
    accuracy: 84,
    averageTime: 45,
    rank: 15,
    streak: 7,
    level: 12,
    xp: 2450,
    nextLevelXp: 2800
  };

  const achievements = [
    { 
      id: 1, 
      name: 'First Steps', 
      description: 'Complete your first contest',
      icon: Trophy, 
      color: 'from-yellow-400 to-yellow-600',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      earned: true,
      earnedDate: '2024-01-10',
      rarity: 'common'
    },
    { 
      id: 2, 
      name: 'Speed Demon', 
      description: 'Answer 10 questions in under 30 seconds',
      icon: Zap, 
      color: 'from-purple-400 to-purple-600',
      textColor: 'text-purple-800 dark:text-purple-200',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      earned: true,
      earnedDate: '2024-01-15',
      rarity: 'rare'
    },
    { 
      id: 3, 
      name: 'Perfectionist', 
      description: 'Score 100% in any contest',
      icon: Star, 
      color: 'from-blue-400 to-blue-600',
      textColor: 'text-blue-800 dark:text-blue-200',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      earned: false,
      progress: 95,
      rarity: 'epic'
    },
    { 
      id: 4, 
      name: 'Streak Master', 
      description: 'Maintain a 7-day winning streak',
      icon: Flame, 
      color: 'from-red-400 to-red-600',
      textColor: 'text-red-800 dark:text-red-200',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      earned: true,
      earnedDate: '2024-01-20',
      rarity: 'rare'
    },
    { 
      id: 5, 
      name: 'Math Wizard', 
      description: 'Score 90%+ in 5 math contests',
      icon: Brain, 
      color: 'from-green-400 to-green-600',
      textColor: 'text-green-800 dark:text-green-200',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      earned: true,
      earnedDate: '2024-01-18',
      rarity: 'epic'
    },
    { 
      id: 6, 
      name: 'Champion', 
      description: 'Reach top 10 in global leaderboard',
      icon: Crown, 
      color: 'from-amber-400 to-amber-600',
      textColor: 'text-amber-800 dark:text-amber-200',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
      earned: false,
      progress: 60,
      rarity: 'legendary'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 dark:text-gray-400';
      case 'rare': return 'text-blue-600 dark:text-blue-400';
      case 'epic': return 'text-purple-600 dark:text-purple-400';
      case 'legendary': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getRarityBadge = (rarity: string) => {
    const colors = {
      common: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
      rare: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200',
      epic: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200',
      legendary: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
    };
    
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[rarity as keyof typeof colors]}`}>
        {rarity.toUpperCase()}
      </span>
    );
  };

  const handleSave = () => {
    hapticFeedback('notification', 'success');
    setIsEditing(false);
  };

  const handleCancel = () => {
    hapticFeedback('impact', 'light');
    setIsEditing(false);
    setEditedProfile({
      displayName: user?.first_name || '',
      grade: '11th Grade',
      subjects: ['Mathematics', 'Science', 'English']
    });
  };

  const toggleSubject = (subject: string) => {
    setEditedProfile(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const availableSubjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology'];

  const earnedAchievements = achievements.filter(a => a.earned);
  const unlockedAchievements = achievements.filter(a => !a.earned);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account and track your achievements
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {user?.photo_url ? (
              <img
                src={user.photo_url}
                alt={user.first_name}
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900 shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-blue-100 dark:border-blue-900 shadow-lg">
                <span className="text-white text-2xl font-bold">
                  {user?.first_name?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.displayName}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, displayName: e.target.value }))}
                  className="text-xl font-bold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg px-3 py-1 mb-2"
                />
              ) : (
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {user?.first_name || 'Student'}
                  {user?.last_name && ` ${user.last_name}`}
                </h2>
              )}
              <div className="flex items-center space-x-2 mb-2">
                <p className="text-gray-600 dark:text-gray-400">
                  @{user?.username || 'student'}
                </p>
                {user?.is_premium && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full">
                    Premium
                  </span>
                )}
              </div>
              
              {/* Level and XP */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Level {userStats.level}
                  </span>
                </div>
                <div className="flex-1 max-w-32">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {userStats.xp}/{userStats.nextLevelXp} XP
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Grade Level
            </label>
            {isEditing ? (
              <select
                value={editedProfile.grade}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, grade: e.target.value }))}
                className="w-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600"
              >
                <option value="9th Grade">9th Grade</option>
                <option value="10th Grade">10th Grade</option>
                <option value="11th Grade">11th Grade</option>
                <option value="12th Grade">12th Grade</option>
              </select>
            ) : (
              <div className="text-gray-800 dark:text-white">{editedProfile.grade}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Rank
            </label>
            <div className="flex items-center">
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">#{userStats.rank}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">Global</span>
              <TrendingUp className="w-4 h-4 text-green-500 ml-2" />
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Favorite Subjects
          </label>
          {isEditing ? (
            <div className="flex flex-wrap gap-2">
              {availableSubjects.map(subject => (
                <button
                  key={subject}
                  onClick={() => toggleSubject(subject)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    editedProfile.subjects.includes(subject)
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {editedProfile.subjects.map(subject => (
                <span
                  key={subject}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium"
                >
                  {subject}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {userStats.totalContests}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Contests</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {userStats.accuracy}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {userStats.averageTime}s
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Time</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {userStats.streak}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="space-y-6">
        {/* Earned Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Earned Achievements ({earnedAchievements.length})
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round((earnedAchievements.length / achievements.length) * 100)}% Complete
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {earnedAchievements.map(achievement => {
              const IconComponent = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`relative p-4 rounded-xl border-2 ${achievement.borderColor} ${achievement.bgColor} transition-all hover:scale-105 cursor-pointer group`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-bold ${achievement.textColor}`}>
                          {achievement.name}
                        </h4>
                        {getRarityBadge(achievement.rarity)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        Earned {new Date(achievement.earnedDate!).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Locked Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-gray-500" />
            Locked Achievements ({unlockedAchievements.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements.map(achievement => {
              const IconComponent = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className="relative p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 opacity-75 hover:opacity-90 transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-600 dark:text-gray-400">
                          {achievement.name}
                        </h4>
                        {getRarityBadge(achievement.rarity)}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                        {achievement.description}
                      </p>
                      
                      {/* Progress bar for achievements with progress */}
                      {achievement.progress && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${achievement.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;