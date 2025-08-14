// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useLocation, Navigate } from "react-router-dom";
import { getStudentById } from "../services/studentServices";
import { AuthStudent } from "../types";
import { useTelegram } from "../hooks/useTelegram";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";

interface AuthContextType {
  user: AuthStudent | null;
  isLoading: boolean;
  error: string | null;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthStudent | null>(null);
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );
  const [error, setError] = useState<string | null>(null);
  const { user: tgUser } = useTelegram();
  const location = useLocation();

  // 1. Use useCallback to create a stable fetch function
  const fetchUser = useCallback(async () => {
    // Don't do anything if we don't have the telegram user ID yet
    if (!tgUser?.id) {
      setStatus("error");
      setError(
        "Telegram user not found. Please open this app through Telegram."
      );
      return;
    }

    setStatus("pending");
    setError(null);

    try {
      // 2. CRITICAL FIX: Use the actual Telegram user ID, not a hardcoded one
      const student = await getStudentById(tgUser.id.toString());
      setUser(student); // Can be a user object or null
      setStatus("success");
    } catch (err) {
      // More robust error message handling
      const message =
        (err as any)?.message ||
        "An unexpected error occurred while fetching your data.";
      setError(message);
      setStatus("error");
    }
  }, [tgUser]);

  // Initial fetch when the component mounts or tgUser changes
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const isLoading = status === "pending";

  // Show a full-page loader during the initial pending state
  if (isLoading) {
    return <Loader />;
  }

  // Show a full-page, actionable error state if fetching fails
  if (status === "error") {
    return (
      <ErrorState
        title="Authentication Failed"
        description={error || "We couldn't verify your identity."}
        onRetry={fetchUser} // The retry button now correctly re-triggers the fetch
        retryText="Try Again"
      />
    );
  }

  // 3. Use declarative navigation for better stability (no flicker)
  // If the fetch is successful but no user was found, and we're not on the register page, redirect.
  if (!user && location.pathname !== "/register") {
    return <Navigate to="/register" replace />;
  }

  // If a user exists but they somehow land on the register page, send them to the home page.
  if (user && location.pathname === "/register") {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, provide the context and render the app
  return (
    <AuthContext.Provider
      value={{ user, isLoading, error, refreshUser: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
