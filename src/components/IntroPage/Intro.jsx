import React from "react";
import { useEffect, useState } from "react";
import "./front.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { calculateTimeLeft } from "@/lib/claculateTimeLeft";
import TransitionsSnackbar from "../QuizPage/TransitionsSnackbar";

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

const Intro = () => {
  const [timeLeft, setTimeLeft] = useState(-1);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchTime() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/contest_id",
          {
            withCredentials: true,
          }
        );
        const remainingTime = calculateTimeLeft(
          response.data.startTime,
          response.data.endTime
        );
        setTimeLeft(remainingTime);
      } catch (error) {
        setError(false);
      }
    }
    fetchTime();

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime < 0) {
          clearInterval(interval);
          return -1;
        }
        if (prevTime == 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = timeLeft > 0 ? formatTime(timeLeft) : "00:00:00";

  return (
    <div className="container">
      {<TransitionsSnackbar error={error} />}
      <div className="circlebg"></div>
      <div className="circlebg1"></div>
      <div className="circlebg2"></div>
      <div className="circlebg3"></div>
      <div className="circlebg4"></div>

      <div className="centercircle">
        <div className="circle">
          <div className="title">Contest</div>
          <div className="subtitle">Victory</div>
        </div>

        <p className="statusText">
          <span>{formattedTime}</span>
          <span>{timeLeft > 0 && "Before Contest Start"}</span>
        </p>

        <div className="timer">
          {timeLeft === 0 && !error && (
            <Link
              to="/quizpage"
              style={{
                backgroundColor: "#1A4D7C",
                color: "white",
                border: "none",
                borderRadius: "20px",
                padding: "10px 20px",
                fontSize: 30,
                cursor: "pointer",
                transition: "background-color 0.3s",
                width: 262,
                height: 59,
              }}
            >
              Start
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Intro;
