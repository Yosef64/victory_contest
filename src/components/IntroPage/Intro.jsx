import React, { useRef } from "react";
import { useEffect, useState } from "react";
import "./front.css";
import { Link, useNavigate } from "react-router-dom";
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
  const isLate = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTime() {
      try {
        //if event ended

        // const response = await axios.get(
        //   "http://localhost:5000/api/contest_id",
        //   {
        //     withCredentials: true,
        //   }
        // );
        // const remainingTime = await calculateTimeLeft(
        //   response.data.startTime,
        //   response.data.endTime
        // );

        const remainingTime = await calculateTimeLeft(
          "2024-11-10T12:00:40",
          "2024-11-10T12:00:40"
        );
        if (remainingTime <= 5000) {
          // Expand the app to full screen
          navigate("/eventended");
        } else {
          // if the event not ended
          // const response = await axios.get(
          //   "http://localhost:5000/api/contest_id",
          //   {
          //     withCredentials: true,
          //   }
          // );
          // const remainingTime = calculateTimeLeft(
          //   response.data.startTime,
          //   response.data.endTime
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
          {timeLeft === 0 && !error && (
            <div
              onClick={() => {
                try {
                  //send active states to

                  // const response = await axios.post(
                  //   "http://localhost:5000/api/contest_id",
                  //  {id:456789}
                  // );
                  navigate("/quizpage");
                } catch (error) {}
              }}
              style={{
                backgroundColor: "#1A4D7C",
                color: "white",
                border: "none",
                borderRadius: "16px",
                padding: "4px 24px",
                fontSize: 24,
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              Start
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Intro;
