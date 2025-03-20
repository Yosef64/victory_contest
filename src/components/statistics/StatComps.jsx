import { checkUser, getQuickStats } from "@/lib/utils";
import { BicepsFlexed, Clock, TrendingUp, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function QuickStats() {
  const { id } = useParams();
  const [quickStat, setQuickStat] = useState({
    time: "",
    contests: 0,
    points: 0,
  });
  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        const res = await getQuickStats(id);
        setQuickStat(res);
      } catch (error) {}
    };
    fetchQuickStats();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-xl">
        <Clock className="w-5 h-5 text-indigo-400 mb-2" />
        <p className="text-xs text-gray-400">Time Spent</p>
        <p className="text-lg font-bold">{quickStat.time}</p>
      </div>
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-xl">
        <BicepsFlexed className="w-5 h-5 text-purple-400 mb-2" />
        <p className="text-xs text-gray-400">Total Contests</p>
        <p className="text-lg font-bold">{quickStat.contests}</p>
      </div>
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-xl">
        <Trophy className="w-5 h-5 text-blue-400 mb-2" />
        <p className="text-xs text-gray-400">Point Earned</p>
        <p className="text-lg font-bold">{quickStat.points}</p>
      </div>
    </div>
  );
}

export function Header() {
  const { id } = useParams();
  const [student, setStudent] = useState({});
  const [status, setStatus] = useState("pending");
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const student = await checkUser(id);
        setStudent(student);
        setStatus("success");
      } catch (error) {
        setStatus("error");
      }
    };
    fetchStudent();
  }, []);
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={status === "success" ? student.imgurl : ""}
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-indigo-500"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0A0A0A]"></div>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            {status === "success" ? student.name : "--- ---"}
          </h1>
          <p className="text-sm text-gray-400">Performance Overview</p>
        </div>
      </div>
      <button className="p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 transition-all">
        <TrendingUp className="w-5 h-5 text-indigo-400" />
      </button>
    </div>
  );
}
