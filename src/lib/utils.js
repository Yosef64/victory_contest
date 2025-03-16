import axios from "axios";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API;

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function getContest(contest_id) {
  const res = await axios.get(`${VITE_BACKEND_API}/api/contest/${contest_id}`);
  const { contest } = res.data;
  return contest;
}
export async function addStudent(student) {
  const res = await axios.post(`${VITE_BACKEND_API}/api/student/`, {
    student,
  });
  return res;
}
export async function checkUser(telegram_id) {
  const res = await axios.get(`${VITE_BACKEND_API}/api/student/${telegram_id}`);
  return res.data;
}
export async function uploadeImage(formData) {
  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dud4t1ptn/image/upload",
    formData
  );
  return res.data;
}
