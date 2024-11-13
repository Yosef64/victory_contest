// import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LeaderBoard from "./components/leaderBoard/LeaderBoard";
import QuizPage from "./components/QuizPage/QuizPage";
import Front from "./components/Contest_Front/Front";
import Register from "./components/register/Register";

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
    {
      path: "intro",
      element: <Front />,
    },
    {
      path: "register",
      element: <Register />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
