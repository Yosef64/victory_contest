import React, { useContext } from "react";
import "./chooseCard.css";
import { Alert } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { AnswerContext } from "../QuizPage/QuizPage";
function ChooseCard({ choice, setSelected, flag, question_id }) {
  const { answersRef } = useContext(AnswerContext);

  return (
    <Alert
      onClick={async (e) => {
        setSelected(choice);
        answersRef.current[question_id] = choice;
      }}
      icon={false} // Hide default icon
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        position: "relative",
        ".MuiAlert-message": {
          width: "100%",
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        },
        backgroundColor: !flag ? "#fff" : "#ABD1C6",
        color: !flag ? "#000" : "#000",
        borderRadius: "8px",
        marginTop: "16px",
        boxShadow: "0px 1px 1px 1px #00000026;",
      }}
    >
      <div className="text-sm">{choice}</div>
      <div>
        {flag ? (
          <CheckCircleIcon />
        ) : (
          <input
            type="radio"
            style={{
              width: "20px",
              height: "20px",
              margin: 0,
              display: "flex",
              alignItems: "center",
            }}
          />
        )}
      </div>
    </Alert>
  );
}

export default ChooseCard;
