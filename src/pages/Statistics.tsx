import React, { useState, useEffect } from "react";
import { useTelegram } from "../hooks/useTelegram";
import { UserStats } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  BarChart3,
  Target,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Lightbulb,
  BookOpen,
  Award,
  Zap,
  Brain,
} from "lucide-react";
import api from "../services/api";

const Statistics: React.FC = () => {
  const { user } = useTelegram();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<
    "subjects" | "chapters" | "grades"
  >("subjects");

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/statistics/${user.id}`);
        if (res.data && res.data.data) {
          setStats(res.data.data);
        } else {
          setError("Invalid statistics data format");
        }
      } catch (err) {
        setError("Failed to fetch statistics");
        console.error("Error fetching statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "#10b981"; // green
    if (accuracy >= 80) return "#3b82f6"; // blue
    if (accuracy >= 70) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  const getImprovementAreas = () => {
    if (!stats) return [];

    const allData = [
      ...Object.entries(stats.subjects || {}).map(([name, data]) => ({
        name,
        ...data,
        type: "Subject",
      })),
    ]
      .filter((item) => item.accuracy < 85)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5);

    return allData;
  };

  const getStrengths = () => {
    if (!stats) return [];

    const allData = [
      ...Object.entries(stats.subjects || {}).map(([name, data]) => ({
        name,
        ...data,
        type: "Subject",
      })),
    ]
      .filter((item) => item.accuracy >= 85)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 5);

    return allData;
  };

  const getPerformanceTrend = () => {
    if (!stats || !stats.performance_trend) return [];
    return stats.performance_trend.map(
      (item: { month: string; accuracy: number; questions: number }) => ({
        month: item.month,
        accuracy: item.accuracy,
        questions: item.questions,
      })
    );
  };

  const getRadarData = () => {
    if (!stats) return [];

    const mainSubjects = [
      "Mathematics",
      "Science",
      "English",
      "History",
      "Geography",
    ];

    return mainSubjects.map((subject) => ({
      subject,
      accuracy: stats.subjects?.[subject]?.accuracy || 0,
      fullMark: 100,
    }));
  };

  const getChartData = () => {
    if (!stats) return [];

    const dataMap = {
      subjects: stats.subjects || {},
      chapters: stats.chapters || {},
      grades: stats.grades || {},
    };

    return Object.entries(dataMap[selectedFilter])
      .map(([key, value]) => ({
        name: key.length > 10 ? `${key.substring(0, 8)}...` : key,
        fullName: key,
        accuracy: value.accuracy,
        correct: value.correct,
        total: value.total,
        incorrect: value.total - value.correct,
      }))
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 10);
  };

  const getPieData = () => {
    return getChartData().map((item) => ({
      name: item.name,
      value: item.accuracy,
      color: getAccuracyColor(item.accuracy),
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <div className="text-lg mb-2">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="text-2xl mb-2">No statistics available yet.</div>
        <div className="text-sm">
          Participate in contests to see your statistics!
        </div>
      </div>
    );
  }

  const chartData = getChartData();
  const pieData = getPieData();
  const performanceTrend = getPerformanceTrend();
  const radarData = getRadarData();
  const improvementAreas = getImprovementAreas();
  const strengths = getStrengths();

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-blue-500" />
            <div className="flex items-center text-green-500">
              <ArrowUp size={16} />
              <span className="text-sm font-medium">+12%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {stats.total_contests}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Contests
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-green-500" />
            <div className="flex items-center text-green-500">
              <ArrowUp size={16} />
              <span className="text-sm font-medium">+5%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {stats.accuracy}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Overall Accuracy
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-purple-500" />
            <div className="flex items-center text-red-500">
              <ArrowDown size={16} />
              <span className="text-sm font-medium">-3s</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {stats.average_time}s
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Avg. Response Time
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            <div className="flex items-center text-green-500">
              <ArrowUp size={16} />
              <span className="text-sm font-medium">+28</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {stats.correct_answers}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Correct Answers
          </div>
        </div>
      </div>

      {/* Performance Trend Chart */}
      {performanceTrend.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Performance Trend (Last 6 Months)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrend}>
                <defs>
                  <linearGradient
                    id="colorAccuracy"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  formatter={(value) => [`${value}%`, "Accuracy"]}
                />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAccuracy)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Subject Performance Radar */}
      {radarData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            Core Subject Performance
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                />
                <Radar
                  name="Accuracy"
                  dataKey="accuracy"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  formatter={(value) => [`${value}%`, "Accuracy"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Performance Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
              Performance by{" "}
              {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
            </h3>
            <div className="flex space-x-2">
              {(["subjects", "chapters", "grades"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedFilter === filter
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#6b7280" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  formatter={(value, name) => [
                    name === "accuracy" ? `${value}%` : value,
                    name === "accuracy"
                      ? "Accuracy"
                      : name === "correct"
                      ? "Correct"
                      : "Incorrect",
                  ]}
                  labelFormatter={(label) =>
                    chartData.find((item) => item.name === label)?.fullName ||
                    label
                  }
                />
                <Bar dataKey="accuracy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-500" />
            Accuracy Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  formatter={(value) => [`${value}%`, "Accuracy"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Areas for Improvement*/}
      <div className="grid md:grid-cols-2 gap-6">
        {improvementAreas.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Areas for Improvement
            </h3>
            <div className="space-y-3">
              {improvementAreas.map((area, index) => (
                <div
                  key={area.name}
                  className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {area.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {area.correct}/{area.total} correct • {area.type}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {area.accuracy}%
                    </div>
                    <div className="text-xs text-gray-500">Accuracy</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                    Recommendation
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-400">
                    Focus on practicing {improvementAreas[0]?.name} questions.
                    Consider reviewing fundamental concepts and taking practice
                    tests.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {strengths.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Your Strengths
            </h3>
            <div className="space-y-3">
              {strengths.map((strength) => (
                <div
                  key={strength.name}
                  className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {strength.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {strength.correct}/{strength.total} correct •{" "}
                        {strength.type}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {strength.accuracy}%
                    </div>
                    <div className="text-xs text-gray-500">Accuracy</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="flex items-start space-x-2">
                <Zap className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <div className="font-medium text-green-800 dark:text-green-300 mb-1">
                    Keep it up!
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-400">
                    You're excelling in {strengths[0]?.name}. Use this strength
                    to tackle more challenging problems in this area.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Study Plan Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
          Personalized Study Plan
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
            <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
              This Week
            </div>
            <div className="text-gray-800 dark:text-white font-medium mb-1">
              Focus on {improvementAreas[0]?.name || "your weakest area"}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Practice 15-20 questions daily
            </div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
            <div className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
              Next Week
            </div>
            <div className="text-gray-800 dark:text-white font-medium mb-1">
              Review {improvementAreas[1]?.name || "another weak area"}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Take 2 practice tests
            </div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
            <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
              Goal
            </div>
            <div className="text-gray-800 dark:text-white font-medium mb-1">
              Reach 90% Accuracy
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              In your weak areas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
