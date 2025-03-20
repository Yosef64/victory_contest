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

  return <Intro1 />;
};

export default Intro;
