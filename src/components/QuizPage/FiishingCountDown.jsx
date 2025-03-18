import { getTimeRemaining } from "@/lib/helpers";
import { useState, useEffect } from "react";

export default function FishingCountDown({
  start_time,
  end_time,
  setIsQuizComplete,
}) {
  const [timeLeft, setTimeLeft] = useState(
    getTimeRemaining(end_time, start_time)
  );
  const remainingTime = getTimeRemaining(end_time, start_time);
  if (remainingTime === "00:00:00") {
    setIsQuizComplete(true);
  }
  useEffect(() => {
    const timer = setInterval(() => {
      const remainingTime = getTimeRemaining(end_time, start_time);
      setTimeLeft(remainingTime);

      if (remainingTime === "00:00:00") {
        clearInterval(timer);
        setIsQuizComplete(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [end_time]);

  return <span className="font-mono font-medium text-white">{timeLeft}</span>;
}
