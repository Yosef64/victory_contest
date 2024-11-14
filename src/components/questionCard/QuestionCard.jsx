import React, { useState } from "react";
import "./questionCard.css";
import ChooseCard from "../choosecard/ChooseCard";
import { Stack } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

function QuestionCard({ question, index, length }) {
  const {
    question_id,
    question_text,
    multiple_choice,
    answer,
    explanation,
    grade,
    chapter,
    subject,
  } = question;
  const [selected, setSelected] = useState("");

  return (
    <>
      <div className="question flex flex-col items-center ">
        <div className="relative w-20 h-20 -mb-12 flex items-center justify-center ">
          <CircularProgress
            variant="determinate"
            value={((index + 1) / length) * 100}
            sx={{
              width: "84px !important",
              height: "84px !important",
              position: "absolute",
              color: "#004643",
              zIndex: "1",
            }}
          />
          <CircularProgress
            variant="determinate"
            value={100}
            sx={{
              width: "84px !important",
              height: "84px !important",
              position: "absolute",
              color: "#ABD1C6",
              backgroundColor: "#fff",
              borderRadius: "50%",
            }}
          />
          <span className="text-lg z-10">
            {index + 1}/{length}
          </span>
        </div>

        <p>{question_text}</p>
      </div>
      <div className="chooses">
        <Stack sx={{ width: "100%" }} spacing={2}>
          {multiple_choice.map((choice, index) => {
            return (
              <ChooseCard
                question_id={question_id}
                key={index}
                flag={choice === selected}
                choice={choice}
                setSelected={setSelected}
              />
            );
          })}
        </Stack>
      </div>
    </>
  );
}

export default QuestionCard;
