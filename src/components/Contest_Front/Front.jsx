import { useEffect, useState } from "react";
// import StartButton from "./StartButton ";
import "./front.css";
import { Link } from "react-router-dom";

const Front = () => {
  const [timeLeft, setTimeLeft] = useState("");
  const isstarted = true;

  const handleClick = () => {};
  useEffect(() => {
    const countdownDate = new Date("2024-11-03T00:00:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      if (distance < 0) {
        setTimeLeft("Contest Started");
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours} : ${minutes} : ${seconds}`);
    };

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
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
        <p className="statusText">{isstarted ? "" : " Before Contest"}</p>
        <h1 className="timer">
          {isstarted ? (
            <Link to="/">
              <button
                onClick={handleClick}
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
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#174365")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#1A4D7C")}
              >
                Start
              </button>
            </Link>
          ) : (
            timeLeft
          )}
        </h1>
      </div>
    </div>
  );
};

export default Front;
