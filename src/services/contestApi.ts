import axios from "axios";
import { Contest, LeaderboardEntry } from "../types";
import api from "./api";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const getAllContests = async (): Promise<Contest[]> => {
  const res = await api.get(`/contest/`);
  return res.data.contests;
};

export const getContestById = async (
  contestId: string | number
): Promise<Contest> => {
  const res = await api.get(`/contest/${contestId}`);
  return res.data.contest;
};

export const getActiveContestants = async (
  contestId: string | number
): Promise<any[]> => {
  const res = await api.get(`/contest/active/${contestId}`);
  return res.data.active_contestants;
};

export const getLeaderboardByContest = async (
  contestId: string | number
): Promise<LeaderboardEntry[]> => {
  const res = await api.get(`/student/rank/${contestId}`);
  return res.data.rankings;
};

export const isUserRegistered = async (
  contestId: string,
  studentId: string
): Promise<boolean> => {
  const res = await api.get(`/contest/is_registered/${contestId}/${studentId}`);
  return res.data.registered;
};
export const registerUserForContest = async (
  contestId: string,
  studentId: string
): Promise<boolean> => {
  const res = await api.post(`/contest/register/${contestId}/${studentId}`);
  return res.data.success;
};

export const registerForContest = async (
  contestId: string,
  studentId: string
): Promise<any> => {
  const res = await api.post(`/contest/register`, {
    contest_id: contestId,
    tele_id: studentId,
  });
  return res.data;
};
