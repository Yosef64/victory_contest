import api from "./api";

export async function getAiRecommendationsFromApi(data: {
  subject: string;
  chapters:
    | {
        [key: string]: {
          total: number;
          correct: number;
          accuracy: number;
        };
      }
    | undefined;
}) {
  const res = await api.post("/ai/getRecommendation", data);
  return res.data.recommendation;
}
