import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Lightbulb,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Eye,
  Brain,
  Star,
  AlertTriangle,
  Trophy,
  Timer,
} from "lucide-react";

// Mock useTelegram hook for Telegram Mini App
interface Telegram {
  hapticFeedback: (type: string) => void;
}

const useTelegram = (): Telegram => ({
  hapticFeedback: (type) => console.log(`Haptic feedback: ${type}`),
});

// Question interface
interface Question {
  id: number;
  question_text: string;
  multiple_choice: string[];
  answer: string;
  subject: string;
  chapter: string;
  grade: string;
  difficulty: string;
}

// EditorialQuestion interface
interface EditorialQuestion extends Question {
  explanation: string;
  tips: string[];
  common_mistakes: string[];
  time_complexity?: string;
  difficulty_explanation: string;
  user_answer?: number;
  is_correct?: boolean;
  average_time: number;
  success_rate: number;
}

const ContestEditorial: React.FC = () => {
  const { hapticFeedback } = useTelegram();
  const [searchParams] = useSearchParams();
  const contestId = searchParams.get("id");
  const contestTitle = searchParams.get("title") || "Contest Editorial";

  const [questions, setQuestions] = useState<EditorialQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(
    new Set()
  );
  const [filter, setFilter] = useState<
    "all" | "correct" | "incorrect" | "skipped"
  >("all");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockQuestions: EditorialQuestion[] = [
        {
          id: 1,
          question_text: "What is the derivative of f(x) = x² + 3x + 2?",
          multiple_choice: ["2x + 3", "x² + 3", "2x + 2", "x + 3"],
          answer: "2x + 3",
          subject: "Mathematics",
          chapter: "Calculus",
          grade: "12th",
          difficulty: "medium",
          explanation:
            "To find the derivative of f(x) = x² + 3x + 2, apply the power rule and constant rule:\n\n1. Derivative of x² is 2x\n2. Derivative of 3x is 3\n3. Derivative of 2 is 0\n\nThus: f'(x) = 2x + 3",
          tips: [
            "Use the power rule: d/dx[xⁿ] = nxⁿ⁻¹",
            "Constant derivative is 0",
            "Sum rule applies",
          ],
          common_mistakes: [
            "Forgetting to multiply by the exponent",
            "Not reducing the exponent",
            "Including the constant",
          ],
          difficulty_explanation:
            "Medium difficulty due to multiple derivative rules.",
          user_answer: 0,
          is_correct: true,
          average_time: 45,
          success_rate: 78,
        },
        {
          id: 2,
          question_text: "Which is the chemical formula for water?",
          multiple_choice: ["H₂O", "CO₂", "NaCl", "CH₄"],
          answer: "0",
          subject: "Chemistry",
          chapter: "Basic Chemistry",
          grade: "9th",
          difficulty: "easy",
          explanation:
            "Water has two hydrogen atoms and one oxygen: H₂O.\n\nOthers:\n• CO₂ = Carbon dioxide\n• NaCl = Sodium chloride\n• CH₄ = Methane",
          tips: [
            "Water is H₂O",
            "Subscripts indicate atom count",
            "Common compound",
          ],
          common_mistakes: ["Confusing with CO₂", "Wrong hydrogen count"],
          difficulty_explanation: "Easy, tests basic compound knowledge.",
          user_answer: 1,
          is_correct: false,
          average_time: 15,
          success_rate: 95,
        },
        {
          id: 3,
          question_text: "What is the capital of France?",
          multiple_choice: ["London", "Berlin", "Paris", "Madrid"],
          answer: "2",
          subject: "Geography",
          chapter: "European Geography",
          grade: "10th",
          difficulty: "easy",
          explanation:
            "Paris is France's capital since 987 AD, on the Seine River.\n\nFacts:\n• Population: ~2.1M city, ~12M metro\n• 'City of Light'\n• Home to Eiffel Tower, Louvre",
          tips: [
            "France = Paris",
            "Recall famous landmarks",
            "Compare with other capitals",
          ],
          common_mistakes: [
            "Confusing with other capitals",
            "Mixing countries",
          ],
          difficulty_explanation: "Easy, tests basic capital knowledge.",
          user_answer: undefined,
          is_correct: undefined,
          average_time: 12,
          success_rate: 92,
        },
      ];
      setQuestions(mockQuestions);
      setLoading(false);
    }, 1000);
  }, [contestId]);

  const toggleQuestionExpansion = (questionId: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
    hapticFeedback("selection");
  };

  const getFilteredQuestions = (): EditorialQuestion[] => {
    switch (filter) {
      case "correct":
        return questions.filter((q) => q.is_correct === true);
      case "incorrect":
        return questions.filter((q) => q.is_correct === false);
      case "skipped":
        return questions.filter((q) => q.user_answer === undefined);
      default:
        return questions;
    }
  };

  interface AnswerStatus {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
    border: string;
    text: string;
    gradient: string;
  }

  const getAnswerStatus = (question: EditorialQuestion): AnswerStatus => {
    if (question.user_answer === undefined) {
      return {
        icon: Clock,
        color: "text-amber-500",
        bg: "bg-amber-50 dark:bg-amber-900/20",
        border: "border-amber-200 dark:border-amber-800",
        text: "Skipped",
        gradient: "from-amber-400 to-orange-500",
      };
    }
    if (question.is_correct) {
      return {
        icon: CheckCircle,
        color: "text-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        border: "border-emerald-200 dark:border-emerald-800",
        text: "Correct",
        gradient: "from-emerald-400 to-green-500",
      };
    }
    return {
      icon: XCircle,
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-900/20",
      border: "border-rose-200 dark:border-rose-800",
      text: "Incorrect",
      gradient: "from-rose-400 to-red-500",
    };
  };

  interface DifficultyConfig {
    bg: string;
    text: string;
    border: string;
    icon: string;
  }

  const getDifficultyConfig = (difficulty: string): DifficultyConfig => {
    switch (difficulty) {
      case "easy":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          text: "text-green-800 dark:text-green-300",
          border: "border-green-200 dark:border-green-800",
          icon: "🟢",
        };
      case "medium":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          text: "text-yellow-800 dark:text-yellow-300",
          border: "border-yellow-200 dark:border-yellow-800",
          icon: "🟡",
        };
      case "hard":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          text: "text-red-800 dark:text-red-300",
          border: "border-red-200 dark:border-red-800",
          icon: "🔴",
        };
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-700",
          text: "text-gray-800 dark:text-gray-300",
          border: "border-gray-200 dark:border-gray-700",
          icon: "⚪",
        };
    }
  };

  interface PerformanceStats {
    total: number;
    correct: number;
    incorrect: number;
    skipped: number;
    accuracy: number;
  }

  const getPerformanceStats = (): PerformanceStats => {
    const total = questions.length;
    const correct = questions.filter((q) => q.is_correct === true).length;
    const incorrect = questions.filter((q) => q.is_correct === false).length;
    const skipped = questions.filter((q) => q.user_answer === undefined).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { total, correct, incorrect, skipped, accuracy };
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Loading
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Preparing...
          </p>
        </div>
      </div>
    );
  }

  const stats = getPerformanceStats();
  const filteredQuestions = getFilteredQuestions();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <div className="p-3 max-w-full mx-auto space-y-4">
        {/* Header */}
        <div className="relative">
          <button
            onClick={() => console.log("Navigate back")} // Mock navigation for Telegram Mini App
            className="flex items-center text-blue-600 dark:text-blue-400 mb-4"
          >
            <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-2">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-white/20 dark:border-gray-700/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                    {contestTitle}
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center mt-1">
                    <BookOpen className="w-3 h-3 mr-1 text-yellow-500" />
                    Editorial
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Score
                </div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {stats.accuracy}%
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <Timer className="w-5 h-5 text-blue-500" />
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800 dark:text-white">
                      {stats.total}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Total
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800">
                <div className="flex items-center justify-between">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800 dark:text-white">
                      {stats.correct}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Correct
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg border border-rose-100 dark:border-rose-800">
                <div className="flex items-center justify-between">
                  <XCircle className="w-5 h-5 text-rose-500" />
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800 dark:text-white">
                      {stats.incorrect}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Incorrect
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-800">
                <div className="flex items-center justify-between">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800 dark:text-white">
                      {stats.skipped}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Skipped
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {(["all", "correct", "incorrect", "skipped"] as const).map(
            (filterType) => {
              const count =
                filterType === "all"
                  ? stats.total
                  : filterType === "correct"
                  ? stats.correct
                  : filterType === "incorrect"
                  ? stats.incorrect
                  : stats.skipped;
              const isActive = filter === filterType;

              return (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`flex items-center px-3 py-1.5 rounded-lg font-medium text-sm capitalize ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <span className="mr-1">{filterType}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            }
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question, index) => {
            const isExpanded = expandedQuestions.has(question.id);
            const status = getAnswerStatus(question);
            const difficultyConfig = getDifficultyConfig(question.difficulty);
            const StatusIcon = status.icon;

            return (
              <div
                key={question.id}
                className="bg-white/90 dark:bg-gray-800/90 rounded-lg border border-white/20 dark:border-gray-700/50"
              >
                {/* Question Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`relative w-12 h-12 rounded-lg bg-gradient-to-br ${status.gradient} flex items-center justify-center`}
                      >
                        <StatusIcon className="w-6 h-6 text-white" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-800 dark:bg-white text-white dark:text-gray-800 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                          Question {index + 1}
                        </h3>
                        <div className="flex flex-wrap items-center space-x-2 mt-1">
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-md">
                            📚 {question.subject}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded-md ${difficultyConfig.bg} ${difficultyConfig.text}`}
                          >
                            {difficultyConfig.icon} {question.difficulty}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded-md ${status.bg} ${status.color}`}
                          >
                            {status.text}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                        <Timer className="w-4 h-4 text-purple-600 dark:text-purple-400 mx-auto" />
                        <div className="text-xs font-bold text-purple-800 dark:text-purple-300">
                          {question.average_time}s
                        </div>
                      </div>
                      <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                        <Target className="w-4 h-4 text-green-600 dark:text-green-400 mx-auto" />
                        <div className="text-xs font-bold text-green-800 dark:text-green-300">
                          {question.success_rate}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-3 mb-3">
                    <p className="text-base text-gray-800 dark:text-white">
                      {question.question_text}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 mb-3">
                    {question.multiple_choice.map((option, optionIndex) => {
                      const isCorrect =
                        optionIndex.toString() === question.answer;
                      const isUserAnswer = optionIndex === question.user_answer;

                      return (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-md border ${
                            isCorrect
                              ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                              : isUserAnswer && !isCorrect
                              ? "border-rose-400 bg-rose-50 dark:bg-rose-900/30"
                              : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50"
                          }`}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full border mr-2 flex items-center justify-center text-sm font-bold ${
                                isCorrect
                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                  : isUserAnswer && !isCorrect
                                  ? "border-rose-500 bg-rose-500 text-white"
                                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                              }`}
                            >
                              {isCorrect
                                ? "✓"
                                : isUserAnswer && !isCorrect
                                ? "✗"
                                : String.fromCharCode(65 + optionIndex)}
                            </div>
                            <span className="text-sm text-gray-800 dark:text-white flex-1">
                              {option}
                            </span>
                            {isCorrect && (
                              <div className="flex items-center">
                                <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-xs text-emerald-700 dark:text-emerald-300 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                                  Correct
                                </span>
                              </div>
                            )}
                            {isUserAnswer && !isCorrect && (
                              <div className="flex items-center">
                                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                <span className="text-xs text-rose-700 dark:text-rose-300 px-2 py-1 bg-rose-100 dark:bg-rose-900/30 rounded-md">
                                  Your Answer
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => toggleQuestionExpansion(question.id)}
                    className="w-full flex items-center justify-center py-2 bg-blue-500 text-white rounded-md font-medium text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4" />
                      <span>{isExpanded ? "Hide" : "Show"} Explanation</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="p-4 space-y-4">
                      {/* Detailed Explanation */}
                      <div className="bg-white/80 dark:bg-gray-800/80 rounded-md p-3 border border-blue-100 dark:border-blue-800">
                        <h4 className="flex items-center text-base font-bold text-gray-800 dark:text-white mb-2">
                          <Brain className="w-5 h-5 text-blue-500 mr-2" />
                          Explanation
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                          {question.explanation}
                        </p>
                      </div>

                      {/* Pro Tips */}
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-md p-3 border border-yellow-200 dark:border-yellow-800">
                        <h4 className="flex items-center text-base font-bold text-gray-800 dark:text-white mb-2">
                          <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                          Tips
                        </h4>
                        {question.tips.map((tip, tipIndex) => (
                          <div
                            key={tipIndex}
                            className="flex items-start bg-white/60 dark:bg-gray-800/60 p-2 rounded-md"
                          >
                            <Star className="w-4 h-4 text-yellow-500 mr-2" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {tip}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Common Mistakes */}
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-md p-3 border border-red-200 dark:border-red-800">
                        <h4 className="flex items-center text-base font-bold text-gray-800 dark:text-white mb-2">
                          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                          Mistakes
                        </h4>
                        {question.common_mistakes.map(
                          (mistake, mistakeIndex) => (
                            <div
                              key={mistakeIndex}
                              className="flex items-start bg-white/60 dark:bg-gray-800/60 p-2 rounded-md"
                            >
                              <XCircle className="w-4 h-4 text-red-500 mr-2" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {mistake}
                              </span>
                            </div>
                          )
                        )}
                      </div>

                      {/* Difficulty Analysis */}
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-md p-3 border border-purple-200 dark:border-purple-800">
                        <h4 className="flex items-center text-base font-bold text-gray-800 dark:text-white mb-2">
                          <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
                          Difficulty
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {question.difficulty_explanation}
                        </p>
                      </div>

                      {/* Statistics */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-center border border-blue-200 dark:border-blue-800">
                          <Timer className="w-5 h-5 text-blue-500 mx-auto" />
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {question.average_time}s
                          </div>
                          <div className="text-xs text-blue-700 dark:text-blue-300">
                            Avg Time
                          </div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md text-center border border-green-200 dark:border-green-800">
                          <Target className="w-5 h-5 text-green-500 mx-auto" />
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {question.success_rate}%
                          </div>
                          <div className="text-xs text-green-700 dark:text-green-300">
                            Success
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredQuestions.length === 0 && (
          <div className="text-center py-8">
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-6 border border-white/20 dark:border-gray-700/50">
              <Eye className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-gray-800 dark:text-white">
                No Questions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Try a different filter.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestEditorial;
