import React, { useEffect } from "react";
import "./successPage.css";

const SuccessPage = () => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.close();
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="success-container">
      <div className="success-message">
        <h1>Sign Up Successful!</h1>
        <p>Thank you for registering.</p>
      </div>
    </div>
  );
};

export default SuccessPage;
