function SendScore(answer, serverQuestions) {
  let wrongAnswer = [];
  let score = 0;
  serverQuestions.forEach((question) => {
    if (answer.current[question.question_id] === question.answer) {
      score++;
    } else {
      wrongAnswer.push({
        question_id: question.question_id,
        wrongAnswer: answer.current[question.question_id],
      });
    }
  });
  console.log("score", score);
  console.log("wrongAnswer", wrongAnswer);
}

export default SendScore;
