import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTelegram } from "../hooks/useTelegram";
import QuestionNavigationDropdown from "../components/QuestionNavigationDropdown";
import { Question, ContestAnswer, Contest } from "../types";
import { Clock, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { getContestById } from "../services/contestApi";

const ContestComponent: React.FC = () => {
  const { hapticFeedback, showMainButton, hideMainButton } = useTelegram();
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<ContestAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0); // Will be set after contest is loaded
  const [loading, setLoading] = useState(false);
  const [contestEnded, setContestEnded] = useState(false);
  const [searchParams] = useSearchParams();
  const con = searchParams.get("con");
  const [contest, setContest] = useState({} as Contest);
  const [questions, setQuestions] = useState<Question[]>(
    contest.questions || []
  );

  useEffect(() => {
    if (timeLeft > 0 && !contestEnded) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endContest();
    }
  }, [timeLeft, contestEnded]);

  useEffect(() => {
    const fetchContest = async () => {
      setLoading(true);
      try {
        const contest: Contest = await getContestById(con!);
        setQuestions(contest.questions || []);
        setContest(contest);
        // Calculate time left in seconds
        const now = new Date();
        const endTime = new Date(contest.end_time);
        const diff = Math.floor((endTime.getTime() - now.getTime()) / 1000);
        setTimeLeft(diff > 0 ? diff : 0);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchContest();
  }, []);

  useEffect(() => {
    if (selectedAnswer !== null) {
      showMainButton("Next Question", handleNextQuestion);
    } else {
      hideMainButton();
    }
  }, [selectedAnswer]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answerIndex: string) => {
    setSelectedAnswer(answerIndex);
    hapticFeedback("selection");
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.answer;

    const newAnswer: ContestAnswer = {
      question_id: currentQuestion.id,
      selected_answer: selectedAnswer,
      is_correct: isCorrect,
      time_taken: 60, // Simulate time taken
    };

    const updatedAnswers = [...answers];
    const existingAnswerIndex = updatedAnswers.findIndex(
      (a) => a.question_id === currentQuestion.id
    );

    if (existingAnswerIndex >= 0) {
      updatedAnswers[existingAnswerIndex] = newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }

    setAnswers(updatedAnswers);
    hapticFeedback("impact", "light");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      endContest();
    }
  };

  const handleQuestionSelect = (questionIndex: number) => {
    // Save current answer if one is selected
    if (selectedAnswer !== null) {
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = selectedAnswer === currentQuestion.answer;

      const newAnswer: ContestAnswer = {
        question_id: currentQuestion.id,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        time_taken: 60,
      };

      const updatedAnswers = [...answers];
      const existingAnswerIndex = updatedAnswers.findIndex(
        (a) => a.question_id === currentQuestion.id
      );

      if (existingAnswerIndex >= 0) {
        updatedAnswers[existingAnswerIndex] = newAnswer;
      } else {
        updatedAnswers.push(newAnswer);
      }

      setAnswers(updatedAnswers);
    }

    // Navigate to selected question
    setCurrentQuestionIndex(questionIndex);

    // Check if this question was already answered
    const targetQuestion = questions[questionIndex];
    const existingAnswer = answers.find(
      (a) => a.question_id === targetQuestion.id
    );
    setSelectedAnswer(existingAnswer ? existingAnswer.selected_answer : null);

    hapticFeedback("selection");
  };
  const endContest = () => {
    setContestEnded(true);
    hideMainButton();
    hapticFeedback("notification", "success");

    // Navigate to results after a short delay
    setTimeout(() => {
      navigate("/statistics");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (contestEnded) {
    const correctAnswers = answers.filter((a) => a.is_correct).length;
    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Contest Complete!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Great job! Here's your performance summary:
          </p>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {score}%
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {correctAnswers} out of {totalQuestions} correct
            </div>
          </div>
        </div>
      </div>
    );
  }

  const emptyQuestion: Question = {
    id: "",
    question_text: "",
    answer: "",
    explanation: "",
    subject: "",
    grade: "",
    chapter: "",
    multiple_choice: [],
  };
  const currentQuestion =
    0 <= currentQuestionIndex && currentQuestionIndex < questions.length
      ? questions[currentQuestionIndex]
      : emptyQuestion;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4 space-x-4">
          <QuestionNavigationDropdown
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            onQuestionSelect={handleQuestionSelect}
          />
          <div className="flex items-center text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
            <Clock className="w-4 h-4 mr-2" />
            <span className="font-mono text-sm">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Progress: {Math.round(progress)}%</span>
          <span>{answers.length} answered</span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs font-medium rounded">
              {currentQuestion.subject}
            </span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-medium rounded">
              {currentQuestion.grade}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
          {currentQuestion.question_text}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.multiple_choice.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index.toString())}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedAnswer === index.toString()
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selectedAnswer === index.toString()
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {selectedAnswer === index.toString() && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="font-medium">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="ml-2">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Next Button (for mobile without Telegram main button) */}
      {selectedAnswer !== null && (
        <button
          onClick={handleNextQuestion}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          {currentQuestionIndex < questions.length - 1
            ? "Next Question"
            : "Finish Contest"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      )}
    </div>
  );
};

export default ContestComponent;
