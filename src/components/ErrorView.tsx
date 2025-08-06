import React from "react";
import { Button } from "./ui/button";
import {
  AlertTriangle,
  RefreshCw,
  UserPlus,
  Info,
  Home,
  ArrowLeft,
  Wifi,
  Server,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ErrorViewProps {
  title?: string;
  message?: string;
  type?: "auth" | "network" | "server" | "general";
  actions?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "destructive";
    icon?: React.ReactNode;
  }[];
  showHomeButton?: boolean;
  showBackButton?: boolean;
  className?: string;
}

const ErrorView: React.FC<ErrorViewProps> = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  type = "general",
  actions = [],
  showHomeButton = true,
  showBackButton = true,
  className = "",
}) => {
  const navigate = useNavigate();

  const getErrorIcon = () => {
    switch (type) {
      case "auth":
        return (
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        );
      case "network":
        return (
          <Wifi className="w-8 h-8 text-orange-600 dark:text-orange-400" />
        );
      case "server":
        return (
          <Server className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        );
      default:
        return (
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        );
    }
  };

  const getErrorColor = () => {
    switch (type) {
      case "auth":
        return "bg-red-100 dark:bg-red-900/20";
      case "network":
        return "bg-orange-100 dark:bg-orange-900/20";
      case "server":
        return "bg-purple-100 dark:bg-purple-900/20";
      default:
        return "bg-red-100 dark:bg-red-900/20";
    }
  };

  const defaultActions = [
    ...actions,
    ...(showHomeButton
      ? [
          {
            label: "Go Home",
            onClick: () => navigate("/"),
            variant: "outline" as const,
            icon: <Home className="w-4 h-4" />,
          },
        ]
      : []),
    ...(showBackButton
      ? [
          {
            label: "Go Back",
            onClick: () => navigate(-1),
            variant: "outline" as const,
            icon: <ArrowLeft className="w-4 h-4" />,
          },
        ]
      : []),
  ];

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 ${className}`}
    >
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        <div
          className={`w-16 h-16 ${getErrorColor()} rounded-full flex items-center justify-center mx-auto mb-6`}
        >
          {getErrorIcon()}
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>

        {defaultActions.length > 0 && (
          <div className="space-y-3 mb-6">
            {defaultActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant || "default"}
                className="w-full"
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </div>
        )}

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Need help?</p>
              <p>
                If this problem persists, please contact support or try again
                later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorView;
