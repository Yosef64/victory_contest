import { Contest, LeaderboardEntry } from "../types";
import api from "./api";

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

export const submitContestResult = async (submission: any): Promise<any> => {
  const res = await api.post(`/submission/`, { submission });
  return res.data;
};
export const getEditorial = async (
  student_id: string,
  contest_id: string
): Promise<any> => {
  const res = await api.get(
    `/student/editorial/${student_id}?contest_id=${contest_id}`
  );
  return res.data.editorial;
};
