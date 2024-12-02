import React, { useState } from "react";
import MessageDialog from "./MessageDialog";

function StartButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setIsLoading(false);
  };
  const handleClick = () => {
    if (isLoading) return; // Prevent further clicks if loading
    setIsLoading(true);

    try {
      // const response1 = await axios.get(
      //   "http://localhost:5000/api/contest_id/id",
      //
      // );

      if (!response1.data.status) {
        setOpen(true);
      } else {
        //send active states to
        // const response2 = await axios.post(
        //   "http://localhost:5000/api/contest_id",
        //  {id:456789}
        // );
        // const response3 = await axios.get(
        //   "http://localhost:5000/api/contest_id/id",
        //
        // );
        // if (response2.data.status && response3.data.status  ) {
        //   navigate("/quizpage");
        // }
      }
    } catch (error) {}

    // Simulate an async operation
    setTimeout(() => {
      console.log("Operation completed!");
      setIsLoading(false);
    }, 10000); // 10-second loading time
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
