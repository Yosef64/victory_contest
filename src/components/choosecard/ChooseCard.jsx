import React, { useState } from "react";
import "./chooseCard.css";
import { Alert, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
function ChooseCard({ className, choose, question, setSelected, index, flag }) {
  return (
    <Alert
      onClick={() => setSelected(index)}
      // severity="suc
      icon={false} // Hide default icon
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        position: "relative",
        ".MuiAlert-message": {
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        },
        backgroundColor: !flag ? "#fff" : "#ABD1C6",
        borderRadius: "8px",
        marginTop: "16px",
        boxShadow: "0px 20px 50px -10px #00000026",
      }}
    >
      <div>{choose}</div>
      <div>
        {flag ? (
          <CheckCircleIcon />
        ) : (
          <input type="radio" style={{ width: "20px", height: "20px" }} />
        )}
      </div>
    </Alert>
  );
}

export default ChooseCard;
