import React, { useState } from "react";
import { ChevronLeft, Timer, Trophy, ArrowRight } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { calculateAndSendSubmission } from "@/lib/utils";
import Loader from "../Loader";
import FishingCountDown from "./FiishingCountDown";
// const questions = [
//   {
//     id: 1,
//     question_text:
//       "In what year did the United States host the FIFA World Cup for the first time?",
//     answer: "1994",
//     explanation: "welle",
//     grade: "12",
//     chapter: "2",
//     subject: "Math",
//     multiple_choice: ["1986", "1994", "2002", "2010"],
//   },
//   {
//     id: 2,
//     question_text:
//       "In what year did the United States host the FIFA World Cup for the first time?",
//     explanation: "welle",
//     grade: "12",
//     chapter: "2",
//     subject: "Math",
//     multiple_choice: ["1986", "1994", "2002", "2010"],
//     answer: "1994",
//   },

//   {
//     id: 3,
//     question_text:
//       "In what year did the United States host the FIFA World Cup for the first time?",
//     answer: "1994",
//     explanation: "welle",
//     grade: "12",
//     chapter: "2",
//     subject: "Math",
//     multiple_choice: ["1986", "1994", "2002", "2010"],
//   },
// ];

const cachedAnswers = {};

function QuizePart() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState();
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQueryParams] = useSearchParams();
  const tele_id = searchQueryParams.get("tele_id");
  const contest_id = searchQueryParams.get("contest_id");
  const location = useLocation();
  const navigate = useNavigate();
  const contest = location.state?.contest;

  const questions = contest.questions;
  if (!questions) {
    return <div className="">Try again</div>;
  }
  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
    cachedAnswers[currentQuestion] = answerId;
  };
  if (isLoading) {
    return <Loader />;
  }

  const handleNext = async () => {
    if (currentQuestion === questions.length - 1) {
      setIsLoading(true);
      try {
        await calculateAndSendSubmission(questions, cachedAnswers, {
          tele_id,
          contest_id,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }

      setIsQuizComplete(true);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsQuizComplete(false);
  };

  if (isQuizComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-[#1a1a1a]/80 backdrop-blur-xl rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-8 text-center border border-blue-500/20">
          <Trophy size={80} className="text-blue-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h2>
          <p className="text-1xl text-gray-400 mb-8">
            You scored <span className="font-bold text-blue-400">{score}</span>{" "}
            out of{" "}
            <span className="font-bold text-blue-400">{questions.length}</span>
          </p>
          <div className="w-full bg-[#2a2a2a] h-4 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000"
              style={{ width: `${(score / questions.length) * 100}%` }}
            />
          </div>
          <button
            onClick={() => {
              navigate(
                `/leaderboard?contest_id=${contest_id}&tele_id=${tele_id}`
              );
            }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl text-white font-medium hover:from-blue-500 hover:to-blue-300 transition-all duration-300 shadow-lg shadow-blue-500/20"
          >
            Leaderboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#1a1a1a]/80 backdrop-blur-xl rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden border border-blue-500/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/50 to-[#2a2a2a] p-6 flex items-center justify-between">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={24} />
            <span className="text-lg font-medium">Quiz</span>
          </button>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-blue-500/20">
              <Timer size={20} className="text-blue-400" />
              <FishingCountDown
                setIsQuizComplete={setIsQuizComplete}
                start_time={contest.start_time}
                end_time={contest.end_time}
              />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-[#2a2a2a]">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500 ease-out"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        {/* Question */}
        <div className="p-8">
          <div className="mb-10">
            <span className="text-sm font-medium text-blue-400 mb-2 block">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <h2 className="text-xl opacity-70 font-bold text-white leading-tight">
              {questions[currentQuestion].question_text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {questions[currentQuestion].multiple_choice.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`group w-full p-5 text-left rounded-2xl border transition-all duration-300
                  ${
                    cachedAnswers[currentQuestion] === option
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#2a2a2a] hover:border-blue-500/30"
                  }`}
              >
                <span className="text-md opacity-70 font-medium text-white">
                  {option}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#2a2a2a]">
          <div className="flex justify-between gap-4">
            <button
              className={`px-8 py-3 rounded-xl font-medium transition-colors
                ${
                  currentQuestion === 0
                    ? "bg-[#2a2a2a] text-gray-600 cursor-not-allowed"
                    : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] hover:text-blue-400"
                }`}
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-500 hover:to-blue-300 shadow-blue-500/20
               `}
            >
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizePart;
