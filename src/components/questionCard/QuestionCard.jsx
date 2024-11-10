import React, { useState } from "react";
import "./questionCard.css";
import ChooseCard from "../choosecard/ChooseCard";
import { Stack } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

function QuestionCard() {
  const chooses = ["1986", "1967", "2000", "2010"];
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div className="question flex flex-col items-center">
        <div className="relative w-20 h-20 -mb-12 flex items-center justify-center">
          <CircularProgress
            variant="determinate"
            value={20}
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
            }}
          />
          <span className="text-lg"> 7/8</span>
        </div>

        <p>
          In what year did the United States host the FIFA World Cup for the
          first time
        </p>
      </div>
      <div className="chooses">
        <Stack sx={{ width: "100%" }} spacing={2}>
          {chooses.map((choose, index) => {
            return (
              <ChooseCard
                key={index}
                flag={index == selected}
                index={index}
                question="ui"
                choose={choose}
                className="shadow-lg   rounded-fulls flex"
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
