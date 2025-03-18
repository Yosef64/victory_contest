import React, { useRef } from "react";
import { useEffect, useState } from "react";
import "./front.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { calculateTimeLeft, formatTime } from "@/lib/claculateTimeLeft";
import TransitionsSnackbar from "../QuizPage/TransitionsSnackbar";
import StartButton from "../startButton/StartButton";
import { getContest } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import ErrorComponent from "../Error";
import Loader from "../Loader";
import Intro1 from "./Intro1";

const Intro = () => {
  const [timeLeft, setTimeLeft] = useState(-1);
  const navigate = useNavigate();
  const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const { contest_id } = useParams();
  // const student_id = queryParams.get("tele_id");

  // const {
  //   data: contest,
  //   error,
  //   status,
  // } = useQuery({
  //   queryKey: ["contest", contest_id],
  //   queryFn: () => getContest(contest_id),
  // });
  // console.log(contest);
  // useEffect(() => {
  //   if (status === "success" && contest && Object.keys(contest).length > 0) {
  //     console.log(contest);
  //     const EventEndTime = calculateTimeLeft(contest.start_time);

  //     setTimeLeft(EventEndTime);
  //   }
  // }, [contest, status, navigate]);

  // // Conditional rendering based on status
  // if (status === "pending") {
  //   return <Loader />;
  // }

  // if (status === "error") {
  //   return <ErrorComponent />;
  // }

  // if (status === "success" && Object.keys(contest).length === 0) {
  //   return (
  //     <div className="h-screen">
  //       <ErrorComponent />
  //     </div>
  //   );
  // }
  // console.log(timeLeft);
  // const formattedTime = timeLeft > 0 ? formatTime(timeLeft) : "00:00:00";

  return <Intro1 />;
};

export default Intro;
