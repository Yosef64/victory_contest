import React, { createContext, useRef, useState } from "react";
import "./quizPage.css";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import QuestionCard from "../questionCard/QuestionCard";
import { Button } from "../ui/button";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import TimeCard from "./TimeCard";
import SendScore from "../../lib/SendScore";

export const AnswerContext = createContext();
function QuizPage() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([
    {
      question_id: 1,
      question_text:
        "Which country has won the most FIFA World Cup titles as of 2024?",
      multiple_choice: ["Germany", "Argentina", "Brazil", "France"],
      answer: "Brazil",
      explanation: "Brazil has won a record five World Cup titles.",
      grade: "10",
      chapter: "World Cup History",
      subject: "Football",
    },
    {
      question_id: 2,
      question_text: "Who is known as the ‘King of Football’?",
      multiple_choice: [
        "Diego Maradona",
        "Pelé",
        "Lionel Messi",
        "Cristiano Ronaldo",
      ],
      answer: "Pelé",
      explanation:
        "Pelé, a Brazilian icon, is often called the 'King of Football' for his influence on the sport.",
      grade: "10",
      chapter: "Famous Players",
      subject: "Football",
    },
    {
      question_id: 3,
      question_text:
        "Which player holds the record for the most goals in a single FIFA World Cup?",
      multiple_choice: [
        "Marta",
        "Just Fontaine",
        "Miroslav Klose",
        "Gerd Müller",
      ],
      answer: "Just Fontaine",
      explanation:
        "Just Fontaine scored 13 goals in a single World Cup (1958), a record that still stands.",
      grade: "10",
      chapter: "World Cup Records",
      subject: "Football",
    },
    {
      question_id: 4,
      question_text:
        "Which football club has the most UEFA Champions League titles?",
      multiple_choice: [
        "Barcelona",
        "Manchester United",
        "Real Madrid",
        "AC Milan",
      ],
      answer: "Real Madrid",
      explanation:
        "Real Madrid holds the record for the most Champions League titles.",
      grade: "10",
      chapter: "Club Football",
      subject: "Football",
    },
    {
      question_id: 5,
      question_text: "Who scored the ‘Hand of God’ goal in the 1986 World Cup?",
      multiple_choice: [
        "Cristiano Ronaldo",
        "Pelé",
        "Diego Maradona",
        "Ronaldinho",
      ],
      answer: "Diego Maradona",
      explanation:
        "Diego Maradona famously scored the ‘Hand of God’ goal against England in 1986.",
      grade: "10",
      chapter: "World Cup History",
      subject: "Football",
    },
    {
      question_id: 6,
      question_text: "Which country won the first ever FIFA World Cup in 1930?",
      multiple_choice: ["Brazil", "Uruguay", "Italy", "Argentina"],
      answer: "Uruguay",
      explanation:
        "Uruguay won the inaugural FIFA World Cup in 1930, hosted in their own country.",
      grade: "10",
      chapter: "World Cup History",
      subject: "Football",
    },
    {
      question_id: 7,
      question_text:
        "What is the maximum duration of extra time in a football match if it’s tied after regular time?",
      multiple_choice: ["15 minutes", "20 minutes", "30 minutes", "45 minutes"],
      answer: "30 minutes",
      explanation:
        "Extra time consists of two 15-minute halves, totaling 30 minutes.",
      grade: "10",
      chapter: "Match Rules",
      subject: "Football",
    },
    {
      question_id: 8,
      question_text:
        "Which football player has won the most Ballon d'Or awards as of 2024?",
      multiple_choice: [
        "Lionel Messi",
        "Cristiano Ronaldo",
        "Michel Platini",
        "Zinedine Zidane",
      ],
      answer: "Lionel Messi",
      explanation:
        "Lionel Messi has won the most Ballon d'Or awards, solidifying his legendary status.",
      grade: "10",
      chapter: "Player Records",
      subject: "Football",
    },
    {
      question_id: 9,
      question_text:
        "What is the term for a player scoring three goals in a single game?",
      multiple_choice: ["Brace", "Hat-trick", "Double", "Quadruple"],
      answer: "Hat-trick",
      explanation:
        "A ‘hat-trick’ is when a player scores three goals in one game.",
      grade: "10",
      chapter: "Football Terminology",
      subject: "Football",
    },
    {
      question_id: 10,
      question_text: "Which country hosted the 2010 FIFA World Cup?",
      multiple_choice: ["South Korea", "Brazil", "South Africa", "Germany"],
      answer: "South Africa",
      explanation:
        "South Africa hosted the 2010 FIFA World Cup, the first held in Africa.",
      grade: "10",
      chapter: "World Cup Hosts",
      subject: "Football",
    },
  ]);

  const answersRef = useRef(
    questions.reduce((acc, question) => {
      acc[question.question_id] = "notSelected";
      return acc;
    }, {})
  );

  return (
    <AnswerContext.Provider value={{ answersRef }}>
      <div className="quiz-page">
        <div className="header">
          <div className="back-button">
            <Link to={"/"}>
              <MdOutlineKeyboardArrowLeft />
            </Link>
            <span>Back</span>
          </div>
          <div className="flex items-center gap-2">
            <AccessAlarmIcon />
            <span className="text-lg">
              <TimeCard questions={questions} />
            </span>
          </div>
        </div>
        <div className="questions">
          <Carousel className="question-wrapper flex">
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
                  className="h-14 w-full bg-customGreen static rounded-custom"
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
