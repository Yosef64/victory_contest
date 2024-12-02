import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LeaderBoard from "./components/leaderBoard/LeaderBoard";
import QuizPage from "./components/QuizPage/QuizPage";
import Intro from "./components/IntroPage/Intro";
import Register from "./components/register/Register";
import AgentRegistered from "./components/agentRegister/AgentRegister";
import SuccessPage from "./components/successful/SuccessPage";
import { isRegister } from "./lib/isRegister";
import Profile from "./components/profile/Profile";

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
    { path: "/", element: <Intro />, caseSensitive: false },
    { path: "quizPage", element: <QuizPage />, caseSensitive: false },
    { path: "leaderboard", element: <LeaderBoard />, caseSensitive: false },
    { path: "profile/:id", element: <Profile />, caseSensitive: false },
    { path: "register", element: <Register />, caseSensitive: false },
    {
      path: "agentRegister/:id",
      element: <AgentRegistered />,
      loader: ({ params }) => isRegister(params.id),
      caseSensitive: false,
    },
    { path: "successPage", element: <SuccessPage />, caseSensitive: false },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
