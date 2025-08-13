import api from "./api";

interface PracticeSettings {
  subject: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard" | "";
}
export async function getAiGeneratedQuestions(setting: PracticeSettings) {
  const res = await api.post("/ai/generate-session", setting);
  return res.data.message;
}
