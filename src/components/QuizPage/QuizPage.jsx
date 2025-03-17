import { createContext, useRef, useState } from "react";
import "./quizPage.css";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import QuestionCard from "../questionCard/QuestionCard";
import { Button } from "../ui/button";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import TimeCard from "./TimeCard";
import SendScore from "../../lib/SendScore";
import AlertDialogSlide from "./AlertDialogSlide";
import { useQuery } from "@tanstack/react-query";

export const AnswerContext = createContext();
function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const contest_id = queryParams.get("contest_id");
  const Student_id = queryParams.get("tele_id");
  const questions = location.state?.questions;

  const answersRef = useRef(
    questions.reduce((acc, question) => {
      acc[question.question_id] = "notSelected";
      return acc;
    }, {})
  );
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/successPage");
  };
  const navigatePage = () => {
    navigate("/leaderboard");
  };
  return (
    <AnswerContext.Provider value={{ answersRef }}>
      <div className="quiz-page">
        {open && (
          <AlertDialogSlide
            handleClose={handleClose}
            navigatePage={navigatePage}
          />
        )}
        <div className="header">
          <div className="back-button">
            <button onClick={handleClickOpen}>
              <MdOutlineKeyboardArrowLeft /> <span>Back</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <AccessAlarmIcon />
            <span className="text-lg">
              <TimeCard questions={questions} />
            </span>
          </div>
        </div>
        <div className="questions">
          <Carousel className="question-wrapper ">
            <div className="slides flex-1 w-full">
              <CarouselContent>
                {questions &&
                  questions.map((question, index) => {
                    return (
                      <CarouselItem key={index}>
                        <QuestionCard
                          question={question}
                          index={index}
                          length={questions.length}
                        />
                      </CarouselItem>
                    );
                  })}
              </CarouselContent>
            </div>
            <div className="change-buttons">
              <div className="relative flex-1 ">
                <CarouselPrevious className="static w-full rounded-custom" />
              </div>
              <div className="relative flex-1 ">
                <CarouselNext className="static w-full rounded-custom" />
              </div>
              <div className="flex-1 ">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-full bg-customGreen static rounded-custom"
                  onClick={() => {
                    SendScore(answersRef, questions);
                    navigate("/leaderboard");
                  }}
                >
                  <span>Submit</span>
                </Button>
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </AnswerContext.Provider>
  );
}

export default QuizPage;
