import React, { useEffect, useState, useMemo, useContext } from "react";
import { AnswerContext } from "@/components/QuizPage/QuizPage";
import { useNavigate } from "react-router-dom";
import sendScore from "@/lib/SendScore";

function calculateTimeLeft(startTime, endTime) {
  const now = new Date(startTime);
  const target = new Date(endTime);
  const diff = target - now;
  return Math.max(diff, 0); // Ensure it doesn't go negative
}

function formatTime(diff) {
  const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(
    2,
    "0"
  );
  const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(
    2,
    "0"
  );
  const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function TimeCard({ questions }) {
  const navigate = useNavigate();
  const { answersRef } = useContext(AnswerContext);
  const [timeLeft, setTimeLeft] = useState(-1);

  const endTime = "2024-11-10T12:00:12";
  const startTime = "2024-11-10T12:00:00";

  useEffect(() => {
    const remainingTime = calculateTimeLeft(startTime, endTime);
    setTimeLeft(remainingTime);

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(prevTime - 1000, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle the navigation and score submission when timeLeft reaches 0
  useEffect(() => {
    if (timeLeft === 0) {
      sendScore(answersRef, questions);
      // navigate("/leaderboard");
    }
  }, [timeLeft, answersRef, questions, navigate]);

  const formattedTime = useMemo(() => formatTime(timeLeft), [timeLeft]);

  return <div>{formattedTime}</div>;
}

export default TimeCard;
