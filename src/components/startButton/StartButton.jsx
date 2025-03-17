import React, { useState } from "react";
import MessageDialog from "./MessageDialog";
import { useLocation, useNavigate } from "react-router-dom";

function StartButton({ contest }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tele_id = queryParams.get("tele_id");
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    setIsLoading(false);
  };
  const handleClick = () => {
    navigate(`/quizPage?tele_id=${tele_id}`, { state: { contest: contest } });
  };
  return (
    <>
      <MessageDialog open={open} handleClose={handleClose} />

      <div
        onClick={handleClick}
        style={{
          backgroundColor: "#1A4D7C",
          color: "white",
          border: "none",
          borderRadius: "16px",
          padding: "5px 28px",
          fontSize: 24,
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
      >
        {isLoading ? "Loading..." : "Start"}
      </div>
    </>
  );
}

export default StartButton;
