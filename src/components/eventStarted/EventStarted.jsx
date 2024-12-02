import React, { useEffect } from "react";
import "./eventStarted.css";

const EventStarted = () => {
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
        <h1>Event started</h1>
        <p>Try other time</p>
      </div>
    </div>
  );
};

export default EventStarted;
