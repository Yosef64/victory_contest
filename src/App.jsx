import React from "react";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import LeaderBoard from "./components/leaderBoard/LeaderBoard";
import QuizPage from "./components/QuizPage/QuizPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <QuizPage />,
    },
    {
      path: "Leaderboard",
      element: <LeaderBoard />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
