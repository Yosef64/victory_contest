import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LeaderBoard from "./components/leaderBoard/LeaderBoard";
import QuizPage from "./components/QuizPage/QuizPage";
import Intro from "./components/IntroPage/Intro";
import Register from "./components/register/Register";
import AgentRegisterd from "./components/agetRegister/AgentRegister";
import SuccessPage from "./components/successfull/SuccessPage";
import { isRegister } from "./lib/isRegister";

function App() {
  useEffect(() => {
    // Ensure Telegram Web App SDK is available
    if (window.Telegram && window.Telegram.WebApp) {
      const WebApp = window.Telegram.WebApp;
      // Expand the app to full screen
      WebApp.expand();
      // Set background color based on the Telegram theme's background
    }
  }, []);
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
    {
      path: "agentregister/:id",
      element: <AgentRegisterd />,
      loader: ({ params }) => isRegister(params.id),
    },
    {
      path: "successPage",
      element: <SuccessPage />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
