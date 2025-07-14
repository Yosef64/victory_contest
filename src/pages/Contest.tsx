import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import { Question, ContestAnswer } from '../types';
import { Clock, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

const Contest: React.FC = () => {
  const { hapticFeedback, showMainButton, hideMainButton } = useTelegram();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<ContestAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(5400); // 90 minutes in seconds
  const [loading, setLoading] = useState(true);
  const [contestEnded, setContestEnded] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch questions
    setTimeout(() => {
      const sampleQuestions: Question[] = [
        {
          id: 1,
          text: "What is the derivative of x² + 3x + 2?",
          options: ["2x + 3", "x² + 3", "2x + 2", "x + 3"],
          correct_answer: 0,
          subject: "Mathematics",
          chapter: "Calculus",
          grade: "12th",
          difficulty: "medium"
        },
        {
          id: 2,
          text: "Which of the following is the chemical formula for water?",
          options: ["H₂O", "CO₂", "NaCl", "CH₄"],
          correct_answer: 0,
          subject: "Chemistry",
          chapter: "Basic Chemistry",
          grade: "9th",
          difficulty: "easy"
        },
        {
          id: 3,
          text: "What is the capital of France?",
          options: ["London", "Berlin", "Paris", "Madrid"],
          correct_answer: 2,
          subject: "Geography",
          chapter: "European Geography",
          grade: "10th",
          difficulty: "easy"
        }
      ];
      setQuestions(sampleQuestions);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !contestEnded) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endContest();
    }
  }, [timeLeft, contestEnded]);

  useEffect(() => {
    if (selectedAnswer !== null) {
      showMainButton('Next Question', handleNextQuestion);
    } else {
      hideMainButton();
    }
  }, [selectedAnswer]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    hapticFeedback('selection');
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    
    const newAnswer: ContestAnswer = {
      question_id: currentQuestion.id,
      selected_answer: selectedAnswer,
      is_correct: isCorrect,
      time_taken: 60 // Simulate time taken
    };

    setAnswers([...answers, newAnswer]);
    hapticFeedback('impact', 'light');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      endContest();
    }
  };

  const endContest = () => {
    setContestEnded(true);
    hideMainButton();
    hapticFeedback('notification', 'success');
    
    // Navigate to results after a short delay
    setTimeout(() => {
      navigate('/statistics');
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
    const correctAnswers = answers.filter(a => a.is_correct).length;
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
            <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
            <div className="text-gray-600 dark:text-gray-400">
              {correctAnswers} out of {totalQuestions} correct
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="flex items-center text-blue-600 dark:text-blue-400">
            <Clock className="w-4 h-4 mr-1" />
            {formatTime(timeLeft)}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
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
          <div className={`px-2 py-1 text-xs font-medium rounded ${
            currentQuestion.difficulty === 'easy' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : currentQuestion.difficulty === 'medium'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {currentQuestion.difficulty}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
          {currentQuestion.text}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedAnswer === index
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {selectedAnswer === index && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
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
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Contest'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      )}
    </div>
  );
};

export default Contest;