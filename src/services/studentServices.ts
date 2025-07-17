import api from "./api";

export async function getUserStat(user_id: string) {
  const res = await api.get(`/student/${user_id}/statistics`);
  return res.data.message;
}

export async function getUserProfile(user_id: string) {
  const res = await api.get(`/student/${user_id}`);
  return res.data.message;
}
export async function getUserBadge(user_id: string) {
  const res = await api.get(`/student/${user_id}/badge`);
  return res.data.message;
}
