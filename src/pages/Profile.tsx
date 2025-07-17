import { useState, useEffect } from "react";
import { useTelegram } from "../hooks/useTelegram";
import {
  Trophy,
  Zap,
  Star,
  Flame,
  Brain,
  Crown,
  TrendingUp,
  Calendar,
  Lock,
  ChevronsUpDown,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { Button } from "../components/ui/button";
import { Achievement, Student } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import {
  getUserBadge,
  getUserProfile,
  getUserStat,
} from "../services/studentServices";
import { toast } from "sonner";

const Profile = () => {
  const { user, hapticFeedback } = useTelegram();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Student>({
    name: user?.first_name || "",
    grade: "11th Grade",
    city: "",
    region: "",
    school: "",
    imgurl: user?.photo_url || "",
    isSuspended: false,
    telegram_id: user?.id.toString() || "",
    id: user?.id.toString() || "",
    age: "",
  });
  const [userStats, setUserStats] = useState<any>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      if (!user?.id) {
        toast.warning("Unknown User. Please log in in Telegram!", {
          description:
            "We couldn't fetch your profile data because your user ID is not available. Please log in to Telegram to continue.",
          duration: 5000,
          position: "top-center",
          icon: "⚠️",
          action: (
            <Button
              variant={"outline"}
              onClick={() => window.location.reload()}
              className="bg-yellow-500 text-white"
            >
              Reload
            </Button>
          ),
        });
        if (isMounted) setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);
        const [stat, prof, achies] = await Promise.all([
          getUserStat(user.id.toString()),
          getUserProfile(user.id.toString()),
          getUserBadge(user.id.toString()),
        ]);

        if (isMounted) {
          // Validate stats
          if (!stat || typeof stat !== "object") {
            console.error("Invalid stats response:", stat);
            throw new Error("Invalid stats response");
          }
          setUserStats(stat);

          // Validate profile
          if (!prof || typeof prof !== "object") {
            console.error("Invalid profile response:", prof);
            throw new Error("Invalid profile response");
          }
          setEditedProfile({
            name: prof.name || user?.first_name || "",
            grade: prof.grade || "11th Grade",
            city: prof.city || "",
            region: prof.region || "",
            school: prof.school || "",
            imgurl: prof.imgurl || user?.photo_url || "",
            isSuspended: prof.isSuspended ?? false,
            telegram_id: prof.telegram_id || user?.id.toString() || "",
            id: prof.id || user?.id.toString() || "",
            age: prof.age || "",
          });

          // Validate achievements
          if (!Array.isArray(achies)) {
            console.error("Invalid achievements response:", achies);
            throw new Error("Invalid achievements response");
          }
          setAchievements(
            achies
              .filter(
                (a) =>
                  a.name && a.type && a.rarity && typeof a.earned === "boolean"
              )
              .map((a) => ({
                ...a,
                earnedDate: a.earnedDate || undefined,
                progress:
                  typeof a.progress === "number" ? a.progress : undefined,
              }))
          );
        }
      } catch (e) {
        let message = "Unknown error";
        if (e instanceof Error) {
          message = e.message;
          if (e.message.includes("404")) {
            message = "User profile not found. Please ensure you're logged in.";
          } else if (e.message.includes("network")) {
            message = "Network error. Please check your connection.";
          }
        }
        toast.error(message, {
          description:
            "We couldn't fetch your profile data. Please check your internet connection and try again.",
          duration: 5000,
          position: "top-center",
          icon: "⚠️",
          action: {
            label: "Retry",
            onClick: () => fetchStats(),
          },
        });
      } finally {
        if (isMounted) setProfileLoading(false);
      }
    }

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const achievementStyles: any = {
    first: {
      icon: Trophy,
      color: "from-yellow-400 to-yellow-600",
      textColor: "text-yellow-800 dark:text-yellow-200",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    speed: {
      icon: Zap,
      color: "from-purple-400 to-purple-600",
      textColor: "text-purple-800 dark:text-purple-200",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    perfection: {
      icon: Star,
      color: "from-blue-400 to-blue-600",
      textColor: "text-blue-800 dark:text-blue-200",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    streak: {
      icon: Flame,
      color: "from-red-400 to-red-600",
      textColor: "text-red-800 dark:text-red-200",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
    },
    subject: {
      icon: Brain,
      color: "from-green-400 to-green-600",
      textColor: "text-green-800 dark:text-green-200",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    rank: {
      icon: Crown,
      color: "from-amber-400 to-amber-600",
      textColor: "text-amber-800 dark:text-amber-200",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
  };

  // const achievements = [
  //   {
  //     name: "First Steps",
  //     description: "Complete your first contest",
  //     type: "first",
  //     rarity: "common",
  //     earned: true,
  //     earnedDate: "2024-01-10",
  //   },
  //   {
  //     name: "Speed Demon",
  //     description: "Answer 10 questions in under 30 seconds",
  //     type: "speed",
  //     rarity: "rare",
  //     earned: true,
  //     earnedDate: "2024-01-15",
  //   },
  //   {
  //     name: "Perfectionist",
  //     description: "Score 100% in any contest",
  //     type: "perfection",
  //     rarity: "epic",
  //     earned: false,
  //     progress: 95,
  //   },
  //   {
  //     name: "Streak Master",
  //     description: "Maintain a 7-day winning streak",
  //     type: "streak",
  //     rarity: "rare",
  //     earned: true,
  //     earnedDate: "2024-01-20",
  //   },
  //   {
  //     name: "Math Wizard",
  //     description: "Score 90%+ in 5 math contests",
  //     type: "subject",
  //     rarity: "epic",
  //     earned: true,
  //     earnedDate: "2024-01-18",
  //   },
  //   {
  //     name: "Champion",
  //     description: "Reach top 10 in global leaderboard",
  //     type: "rank",
  //     rarity: "legendary",
  //     earned: false,
  //     progress: 60,
  //   },
  // ];

  const getRarityBadge = (rarity: "common" | "rare" | "epic" | "legendary") => {
    const colors = {
      common: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
      rare: "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200",
      epic: "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200",
      legendary: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
    };

    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[rarity]}`}
      >
        {rarity.toUpperCase()}
      </span>
    );
  };

  const handleSave = () => {
    hapticFeedback("notification", "success");
    setIsEditing(false);
  };

  const earnedAchievements = achievements.filter((a) => a.earned);
  const unlockedAchievements = achievements.filter((a) => !a.earned);

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-6 relative">
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
                  {user?.first_name?.charAt(0) || "U"}
                </span>
              </div>
            )}
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) =>
                    setEditedProfile((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="min-w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg px-3 py-1 mb-2"
                />
              ) : (
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {user?.first_name || "Student"}
                  {user?.last_name && ` ${user.last_name}`}
                </h2>
              )}
              <div className="flex items-center space-x-2 mb-2">
                <p className="text-gray-600 dark:text-gray-400">
                  @{user?.username || "student"}
                </p>
                {user?.is_premium && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full">
                    Premium
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Badge
                  variant={
                    editedProfile.isSuspended ? "destructive" : "success"
                  }
                >
                  {editedProfile.isSuspended ? "Suspended" : "Active"}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <Button
                className="absolute top-0 right-0 flex border-1 border-gray-600 items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400  hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Grade Level
            </label>
            {isEditing ? (
              <Select
                value={editedProfile.grade}
                onValueChange={(value) =>
                  setEditedProfile((prev) => ({
                    ...prev,
                    grade: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9th Grade">9th Grade</SelectItem>
                  <SelectItem value="10th Grade">10th Grade</SelectItem>
                  <SelectItem value="11th Grade">11th Grade</SelectItem>
                  <SelectItem value="12th Grade">12th Grade</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="text-gray-800 dark:text-white">
                {editedProfile.grade}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Rank
            </label>
            <div className="flex items-center">
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                #{userStats?.rank || "N/A"}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                Global
              </span>
              <TrendingUp className="w-4 h-4 text-green-500 ml-2" />
            </div>
          </div>
        </div>
        <Collapsible>
          <div className="flex items-center justify-between gap-4 px-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <ChevronsUpDown />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="transition-all duration-1000 ease-in-out data-[state=closed]:h-0 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 overflow-hidden">
            <div className="grid grid-cols-2 gap-4 transition-all duration-1000 ease-in-out data-[state=closed]:h-0 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 overflow-hidden">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  School
                </h4>
                {!isEditing ? (
                  <div className="text-lg font-bold text-gray-800 dark:text-white">
                    {editedProfile.school || "Not provided"}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={editedProfile.school}
                    onChange={(e) =>
                      setEditedProfile((prev) => ({
                        ...prev,
                        school: e.target.value,
                      }))
                    }
                    className="w-24 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg px-3 py-1 mb-2"
                  />
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City
                </h4>
                {!isEditing ? (
                  <div className="text-lg font-bold text-gray-800 dark:text-white">
                    {userStats?.city || "Not provided"}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={editedProfile.city}
                    onChange={(e) =>
                      setEditedProfile((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    className="w-24 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg px-3 py-1 mb-2"
                  />
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Region
                </h4>
                {!isEditing ? (
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {userStats?.region || "Not provided"}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={editedProfile.region}
                    onChange={(e) =>
                      setEditedProfile((prev) => ({
                        ...prev,
                        region: e.target.value,
                      }))
                    }
                    className="w-24 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg px-3 py-1 mb-2"
                  />
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age
                </h4>
                {!isEditing ? (
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {userStats?.age || "Not provided"} years old
                  </div>
                ) : (
                  <input
                    type="text"
                    value={editedProfile.age}
                    onChange={(e) =>
                      setEditedProfile((prev) => ({
                        ...prev,
                        age: e.target.value,
                      }))
                    }
                    className="w-24 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg px-3 py-1 mb-2"
                  />
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        {isEditing && (
          <div className="flex gap-4 space-x-0 mt-4">
            <Button
              onClick={() => setIsEditing(false)}
              className="bg-white text-black border-1 border-gray-300 hover:bg-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-50 text-green-600 font-semibold hover:bg-gray-50"
            >
              Save
            </Button>
          </div>
        )}
      </div>
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {userStats && (
          <>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {userStats.totalContests}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Contests
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {userStats.totalQuestions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Questions
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {userStats.correctAnswers}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Correct
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {userStats.accuracy}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Accuracy
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {userStats.averageTime}s
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Avg. Time
              </div>
            </div>
          </>
        )}
      </div> */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Earned Achievements ({earnedAchievements.length})
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(
                (earnedAchievements.length / achievements.length) * 100
              )}
              % Complete
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {earnedAchievements.map((achievement) => {
              const {
                icon: IconComponent,
                color,
                textColor,
                bgColor,
                borderColor,
              } = achievementStyles[achievement.type];
              return (
                <div
                  key={achievement.name}
                  className={`relative p-4 rounded-xl border-2 ${borderColor} ${bgColor} transition-all hover:scale-105 cursor-pointer group`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-bold ${textColor}`}>
                          {achievement.name}
                        </h4>
                        {getRarityBadge(
                          achievement.rarity as
                            | "common"
                            | "rare"
                            | "epic"
                            | "legendary"
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        Earned{" "}
                        {new Date(achievement.earnedDate!).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-gray-500" />
            Locked Achievements ({unlockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements.map((achievement) => {
              const { icon: IconComponent } =
                achievementStyles[achievement.type];
              return (
                <div
                  key={achievement.name}
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
                        {getRarityBadge(
                          achievement.rarity as
                            | "common"
                            | "rare"
                            | "epic"
                            | "legendary"
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                        {achievement.description}
                      </p>
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
