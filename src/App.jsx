import React from "react";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import LeaderBoard from "./components/leaderBoard/LeaderBoard";
import NewButton from "./components/SHADCD/NewButton";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <NewButton />
          <Link to="Leaderboard">Leaderboard Screen</Link>
        </div>
      ),
    },
    {
      path: "Leaderboard",
      element: <LeaderBoard />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
