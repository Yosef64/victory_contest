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
import EventEnded from "./components/eventEnded/EventEnded";
import Statistics from "./components/statistics/Statistics";

const router = createBrowserRouter([
  { path: "/:contest_id", element: <Intro /> },
  { path: "quizPage", element: <QuizPage /> },
  { path: "leaderboard", element: <LeaderBoard /> },
  { path: "profile/:id", element: <Profile /> },
  { path: "register", element: <Register /> },
  { path: "/statistics/:id", element: <Statistics /> },
  {
    path: "agentRegister/:id",
    element: <AgentRegistered />,
    loader: ({ params }) => isRegister(params.id),
    caseSensitive: false,
  },
  { path: "successPage", element: <SuccessPage />, caseSensitive: false },
  { path: "eventended", element: <EventEnded />, caseSensitive: false },
]);
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

  return <RouterProvider router={router} />;
}

export default App;
