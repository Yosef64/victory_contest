import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTelegram } from "./hooks/useTelegram";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Statistics from "./pages/Statistics";
import Profile from "./pages/Profile";
import Registration from "./pages/Registration";
import ContestComponent from "./pages/Contest";
import ContestEditorial from "./pages/ContestEditorial";
// import ScreenshotProtection from "./components/ScreenProtection";

function App() {
  const { isLoading } = useTelegram();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {" "}
          <Route index element={<Home />} />
          <Route path="contest" element={<ContestComponent />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="registration" element={<Registration />} />
          <Route path="contest-editorial" element={<ContestEditorial />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
