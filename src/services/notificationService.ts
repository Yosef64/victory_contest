import api from "./api";

export async function getNotification(userId: string | number) {
  // Adjust the endpoint as per your backend API
  const res = await api.get(`/notification/${userId}`);
  return res.data.notifications || res.data;
}
