import api from "./api";

export async function getUserStat(user_id: string) {
  const res = await api.get(`/submission/statistics/${user_id}`);
  return res.data.message;
}

export async function getUserProfile(user_id: string) {
  const res = await api.get(`/student/${user_id}`);
  return res.data.student;
}
export async function getUserBadge(user_id: string) {
  const res = await api.get(`/student/student/${user_id}/badge`);
  return res.data.submissions;
}
export async function studentRegister(values: any) {
  const res = await api.post("/student/", values);
  return res.data;
}

export async function getStudentById(id: string) {
  const res = await api.get(`/student/${id}`);
  return res.data.student;
}
