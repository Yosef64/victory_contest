import React from "react";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import LeaderBoard from "./Components/leaderBoard/LeaderBoard";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <h1>Hello World</h1>
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
