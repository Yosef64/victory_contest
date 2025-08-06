import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentById } from "../services/studentServices";
import { AuthStudent } from "../types";
import { useTelegram } from "../hooks/useTelegram";

interface AuthContextType {
  user: AuthStudent | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user: tgUser } = useTelegram();

  useEffect(() => {
    const fetchUser = async () => {
      if (!tgUser?.id) {
        setLoading(false);
        navigate("/register");
        return;
      }
      setLoading(true);
      try {
        const student = await getStudentById(tgUser.id.toString());
        if (!student) {
          setUser(null);
          navigate("/register");
        } else {
          setUser(student);
        }
      } catch (err) {
        setUser(null);
        navigate("/register");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    // Only run on mount or when tgUser changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tgUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
