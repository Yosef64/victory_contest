import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LeaderBoard from "./components/leaderBoard/LeaderBoard";
import QuizPage from "./components/QuizPage/QuizPage";
import Intro from "./components/IntroPage/Intro";
import Register from "./components/register/Register";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Intro />,
    },
    {
      path: "quizpage",
      element: <QuizPage />,
    },
    {
      path: "leaderboard",
      element: <LeaderBoard />,
    },

    {
      path: "register",
      element: <Register />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
