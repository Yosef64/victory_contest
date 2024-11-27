import axios from "axios";
async function SendScore(answer, serverQuestions) {
  let missedQuestion = [];
  let score = 0;
  serverQuestions.forEach((question) => {
    if (answer.current[question.question_id] === question.answer) {
      score++;
    } else {
      missedQuestion.push({
        question_id: question.question_id,
        wrongAnswer: answer.current[question.question_id],
      });
    }
  });
  try {
    await axios.post(
      "http://localhost:5000/test",
      { score: score, missedQuestion: missedQuestion },
      {
        withCredentials: true, // Enable sending cookies with the request
      }
    );
  } catch (error) {
    console.error(error);
  }
}

export default SendScore;
