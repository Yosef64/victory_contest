import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LeaderBoard from "./components/leaderBoard/LeaderBoard";
import QuizPage from "./components/QuizPage/QuizPage";
import Intro from "./components/IntroPage/Intro";
import Register from "./components/register/Register";

function App() {
  useEffect(() => {
    // Ensure Telegram Web App SDK is available
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;

      // Expand the app to full screen
      tg.expand();

      // Set up event handlers if needed
      tg.onEvent("backButtonClicked", () => {
        console.log("Back button clicked");
        // Handle back button event
      });

      // Example to close the Web App from Telegram
      // tg.close();

      console.log("Telegram Web App initialized", tg);
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
  ]);
  return <RouterProvider router={router} />;
}

export default App;
