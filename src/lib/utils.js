import axios from "axios";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import CryptoJS from "crypto-js";
const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API;

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function getContest(contest_id) {
  const res = await axios.get(`${VITE_BACKEND_API}/api/contest/${contest_id}`, {
    timeout: 10000,
  });
  const { contest } = res.data;
  return contest;
}
export async function addStudent(student) {
  const res = await axios.post(
    `${VITE_BACKEND_API}/api/student/`,
    {
      student,
    },
    { timeout: 5000 }
  );
  console.log(res.data);

  return res;
}

export async function updateUser(student) {
  const student_id = student.telegram_id;
  const res = await axios.put(
    `${VITE_BACKEND_API}/api/student/${student_id}`,
    {
      student,
    },
    { timeout: 5000 }
  );

  return res;
}
export async function checkUser(telegram_id) {
  const res = await axios.get(
    `${VITE_BACKEND_API}/api/student/${telegram_id}`,
    { timeout: 10000 }
  );
  const { student } = res.data;
  return student;
}
export async function uploadeImage(file, public_id) {
  const formData = new FormData();
  formData.append("file", file);

  formData.append("public_id", public_id);
  const res = await axios.post(
    `${VITE_BACKEND_API}/api/image/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 10000,
    }
  );
  return res.data;
}

export async function getSummissionByRange(when, contest_id) {
  let res;
  if (when === "today" && contest_id) {
    res = await axios.get(
      `${VITE_BACKEND_API}/api/submission/contest_id/${contest_id}`,
      {
        timeout: 10000,
      }
    );
  } else {
    res = await axios.get(`${VITE_BACKEND_API}/api/submission/${when}`, {
      timeout: 10000,
    });
  }
  const { submissions } = res.data;
  return submissions;
}
export async function calculateAndSendSubmission(questions, cached, data) {
  const st = await checkUser(data.tele_id);

  const submission = {
    student: {
      student_id: data.tele_id,
      imgurl: st.imgurl,
      name: st.name,
    },
    contest_id: data.contest_id,
    submission_time: "",
    score: 0,
    missed_question: [],
  };
  Object.keys(cached).forEach((key) => {
    if (questions[key].answer == cached[key]) {
      submission.score += 1;
    } else {
      submission.missed_question.push(questions[key]);
    }
  });
  const res = await axios.post(`${VITE_BACKEND_API}/api/submission/`, {
    submission,
  });
  return res.data;
}
export async function registerStudentForContest(tele_id, contest_id) {
  const res = await axios.post(
    `${VITE_BACKEND_API}/api/contest/register`,
    {
      tele_id,
      contest_id,
    },
    { timeout: 10000 }
  );
  return res.data;
}
export async function checkUserRegisterForContest(tele_id) {
  const res = await axios.get(
    `${VITE_BACKEND_API}/api/contest/register/${tele_id}`,
    { timeout: 10000 }
  );
  return res.data;
}
export async function getContestNoParticipants(contest_id) {
  const res = await axios.get(
    `${VITE_BACKEND_API}/api/contest/participants/${contest_id}`,
    { timeout: 10000 }
  );
  const { participants } = res.data;
  return participants;
}
export async function fetchUserMissedData(dur, tele_id) {
  const api_path = {
    month: "monthly_missed_questions",
    week: "weekly_missed_questions",
    current: "missed-questions",
  };
  const path = api_path[dur];

  const res = await axios.get(
    `${VITE_BACKEND_API}/api/question/${path}/${tele_id}`
  );
  return res.data;
}

export async function getQuickStats(tele_id) {
  const res = await axios.get(
    `${VITE_BACKEND_API}/api/student/quickstat/${tele_id}`
  );
  const { stat } = res.data;
  return stat;
}
