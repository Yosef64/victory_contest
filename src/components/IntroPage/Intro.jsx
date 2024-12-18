import React, { useRef } from "react";
import { useEffect, useState } from "react";
import "./front.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { calculateTimeLeft } from "@/lib/claculateTimeLeft";
import TransitionsSnackbar from "../QuizPage/TransitionsSnackbar";
import StartButton from "../startButton/StartButton";

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
  const isLate = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTime() {
      try {
        //check if the event ended

        // const response = await axios.get(
        //   "http://localhost:5000/api/contest_id",
        //   {
        //     withCredentials: true,
        //   }
        // );
        // const EventEndTime = await calculateTimeLeft(
        //   response.data.startTime,
        //   response.data.endTime
        // );

        const EventEndTime = await calculateTimeLeft(
          "2024-11-10T12:00:20",
          "2024-11-10T12:00:40"
        );
        if (EventEndTime <= 5000) {
          // Expand the app to full screen
          navigate("/eventended");
        } else {
          // if the event not ended
          // const response2 = await axios.get(
          //   "http://localhost:5000/api/contest_id",
          //   {
          //     withCredentials: true,
          //   }
          // );
          // const remainingTime = calculateTimeLeft(
          //   response2.data.startTime,
          //   response2.data.endTime
          // );
        }
        setTimeLeft(remainingTime);
      } catch (error) {
        setError(false);
      }
    }
    fetchTime();

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }

        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    console.log("Original URL path:", currentPath);

    // Navigate to the current path if needed
    navigate(currentPath);
  }, [navigate]);

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
          <span>{timeLeft > 0 && "Before Contest "}</span>
          <span>{formattedTime}</span>
        </p>

        <div className="timer">
          {timeLeft === 0 && !error && <StartButton />}
        </div>
      </div>
    </div>
  );
};

export default Intro;
