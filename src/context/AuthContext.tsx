import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getStudentById } from "../services/studentServices";
import { AuthStudent } from "../types";
import { useTelegram } from "../hooks/useTelegram";
import Loader from "../components/Loader";
import ErrorView from "../components/ErrorView";
import { RefreshCw, UserPlus } from "lucide-react";
import ErrorState from "../components/ErrorState";

interface AuthContextType {
  user: AuthStudent | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  refreshUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, seterror] = useState<string | null>(null);
  const [userDetermined, setUserDetermined] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user: tgUser } = useTelegram();

  const refreshUser = async () => {
    if (!tgUser?.id) return;

    setLoading(true);
    seterror(null);
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
      if (err && typeof err === "object" && "data" in err) {
        const errorData = err as any;
        if (errorData.data?.response?.error) {
          seterror(errorData.data.response.error);
        } else {
          seterror("Failed to fetch user data");
        }
      } else {
        seterror("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch user once per session
    if (hasFetched || !tgUser?.id) {
      if (!tgUser?.id) {
        setLoading(false);
        setUserDetermined(true);
        navigate("/register");
      }
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      setHasFetched(true);
      try {
        console.log("getting the student");
        const student = await getStudentById(tgUser?.id.toString()!);
        console.log(student);
        if (!student) {
          setUser(null);
          setUserDetermined(true);
          navigate("/register");
        } else {
          setUser(student);
          setUserDetermined(true);
        }
      } catch (err) {
        setUser(null);
        // Proper error handling with type checking
        if (err && typeof err === "object" && "data" in err) {
          const errorData = err as any;
          if (errorData.data?.response?.error) {
            seterror(errorData.data.response.error);
          } else {
            seterror("Failed to fetch user data");
          }
        } else {
          seterror("An unexpected error occurred");
        }
        setUserDetermined(true);
        // navigate("/register");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    // Only run on mount or when tgUser changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tgUser]);

  // Don't render children until we've determined if user exists or not
  if (loading || !userDetermined) {
    return <Loader />;
  }

  if (error) {
    return (
      <ErrorState
        retryText="Try again"
        onRetry={() => setLoading(true)}
        description={error}
      />
    );
  }

  // Only render children if user exists (for all other pages)
  if (!user && location.pathname !== "/register") {
    return null; // Don't render anything while navigating to register
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
