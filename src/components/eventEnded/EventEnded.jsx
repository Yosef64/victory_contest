import React, { useEffect } from "react";
import "./eventEnded.css";

const EventEnded = () => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.close();
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="event-container">
      <div className="event-message">
        <h1>Event Ended</h1>
        <p>Try other time</p>
      </div>
    </div>
  );
};

export default EventEnded;
