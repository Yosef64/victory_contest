import React from "react";
import "./quizPage.css";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";
import QuestionCard from "../questionCard/QuestionCard";
import { Button } from "../ui/button";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
function QuizPage() {
  return (
    <div className="quiz-page">
      <div className="header">
        <div className="back-button">
          <Link to={"/"}>
            <MdOutlineKeyboardArrowLeft />
          </Link>
          <span>Back</span>
        </div>
        <p className="flex items-center gap-2">
          <AccessAlarmIcon /> <span className="text-lg">2:30:20</span>
        </p>
      </div>
      <div className="questions">
        <Carousel className="question-wrapper flex">
          <div className="slides flex-1">
            <CarouselContent>
              <CarouselItem>
                <QuestionCard />
              </CarouselItem>
              <CarouselItem>
                <QuestionCard />
              </CarouselItem>
              <CarouselItem>
                <QuestionCard />
              </CarouselItem>
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
                className="h-14 w-full bg-customGreen static rounded-custom"
              >
                <span>Submit</span>
              </Button>
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  );
}

export default QuizPage;
