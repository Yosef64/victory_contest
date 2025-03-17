import React, { useEffect, useState } from "react";
import "./leaderBoard.css";
import RankCard from "../rankCard/RankCard";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import TopThree, { Leaderboard1 } from "./TopThree";
import { useQuery } from "@tanstack/react-query";
import { getSummissionByRange } from "@/lib/utils";
function LeaderBoard() {
  return <Leaderboard1 />;
}

export default LeaderBoard;
