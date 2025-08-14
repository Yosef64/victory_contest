import { AuthStudent } from "../types";
import api from "./api";

export async function getUserStat(user_id: string) {
  const res = await api.get(`/submission/statistics-profile/${user_id}`);
  return res.data.stat;
}

export async function getUserProfile(user_id: string) {
  const res = await api.get(`/student/${user_id}`);
  return res.data.student;
}

export async function studentRegister(values: any) {
  const res = await api.post("/student/", values);
  return res.data;
}

export async function getStudentById(id: string) {
  const res = await api.get(`/student/${id}`);
  return res.data.student;
}
<<<<<<< HEAD

export async function updateStudentDefaultScoreRange(studentId: string, scoreRange: string) {
  const res = await api.put(`/student/${studentId}/score-range`, { defaultScoreRange: scoreRange });
=======
export async function updateUserInfo(user: AuthStudent) {
  const res = await api.put(`/student/${user.id}`, user);
>>>>>>> 6d98c560a1883ee1c06e8637a49a849053bb6988
  return res.data;
}
