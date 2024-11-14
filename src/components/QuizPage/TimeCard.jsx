import React, { useEffect, useState, useMemo, useContext } from "react";
import { AnswerContext } from "@/components/QuizPage/QuizPage";
import { useNavigate } from "react-router-dom";
import sendScore from "@/lib/SendScore";
import axios from "axios";
import { calculateTimeLeft } from "@/lib/claculateTimeLeft";

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

  useEffect(() => {
    async function fetchTime() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/contest_id",
          {
            withCredentials: true, // Enable sending cookies with the request
          }
        );
        const remainingTime = Math.max(
          calculateTimeLeft(response.data.startTime, response.data.endTime)
        );
        setTimeLeft(remainingTime);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTime();
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
