import React from "react";

const ErrorComponent = () => {
  const handleRefresh = () => {
    window.location.reload(); // Refresh the page
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 ">
      <h2 className="text-2xl font-semibold mb-4">Something Went Wrong!</h2>

      <button
        onClick={handleRefresh}
        className="px-4 py-2 bg-red-600 text-white rounded-[10px] hover:bg-red-700 transition"
      >
        Refresh Page
      </button>
    </div>
  );
};
export default ErrorComponent;
