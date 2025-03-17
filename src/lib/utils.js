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
  const res = await axios.post(
    `${VITE_BACKEND_API}/api/student/`,
    {
      student,
    },
    { timeout: 1000 }
  );
  return res;
}
export async function checkUser(telegram_id) {
  const res = await axios.get(
    `${VITE_BACKEND_API}/api/student/${telegram_id}`,
    { timeout: 1000 }
  );
  return res.data;
}
export async function uploadeImage(formData) {
  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dud4t1ptn/image/upload",
    formData,
    { timeout: 1000 }
  );
  return res.data;
}

export async function getSummissionByRange(when, contest_id) {
  let res;
  if (contest_id) {
    res = await axios.get(`${VITE_BACKEND_API}/api/submission/${contest_id}`, {
      timeout: 1000,
    });
  } else {
    res = await axios.get(`${VITE_BACKEND_API}/api/submission/${when}`, {
      timeout: 1000,
    });
  }
  return res.data;
}
