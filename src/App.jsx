import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LeaderBoard from "./components/leaderBoard/LeaderBoard";
import QuizPage from "./components/QuizPage/QuizPage";
import Intro from "./components/IntroPage/Intro";
import Register from "./components/register/Register";
import AgentRegisterd from "./components/agetRegister/AgentRegister";
import SuccessPage from "./components/successfull/SuccessPage";

function App() {
  useEffect(() => {
    // Ensure Telegram Web App SDK is available
    if (window.Telegram && window.Telegram.WebApp) {
      // const tg = window.Telegram.WebApp;
      // // Expand the app to full screen
      // tg.expand();
      // const themeParams = tg.themeParams;
      // // Set background color based on the Telegram theme's background color
      // document.body.style.backgroundColor = themeParams.bg_color || "#f3f3f3";
      // // Set up event handlers if needed
      // tg.onEvent("backButtonClicked", () => {
      //   document.body.style.backgroundColor = "#000000";
      //   // Handle back button event
      // });
      // Example to close the Web App from Telegram
      // tg.close();
      // console.log("Telegram Web App initialized", tg);
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
    },
    {
      path: "successPage",
      element: <SuccessPage />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
