import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function calculateTimeLeft(targetTime) {
  const now = new Date();
  const target = new Date(targetTime);
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

function TimeCard() {
  const [timeLeft, setTimeLeft] = useState(() =>
    calculateTimeLeft("2024-11-11T21:00:00")
  );
  const navigate = useNavigate();
  const targetTime = "2024-11-11T21:00:00"; // Define target time as a constant

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTime = calculateTimeLeft(targetTime);
      setTimeLeft(remainingTime);

      if (remainingTime <= 0) {
        clearInterval(interval);
        // Optional: navigate or handle when countdown ends
        navigate("/");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, targetTime]);

  const formattedTime = useMemo(() => formatTime(timeLeft), [timeLeft]);

  return <div>{formattedTime}</div>;
}

export default TimeCard;
