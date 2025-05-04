import React from "react";

const GradientLoader = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-8 w-8 border-4",
    md: "h-12 w-12 border-[5px]",
    lg: "h-16 w-16 border-[6px]",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full 
        border-solid border-t-indigo-600 border-r-blue-500 
        border-b-blue-400 border-l-indigo-400 bg-transparent`}
        style={{
          animationDuration: "1.5s",
          background:
            "conic-gradient(transparent 0%, transparent 20%, #4F46E5 80%)",
        }}
      >
        {/* Optional inner ring for extra dimension */}
        <div
          className={`${sizeClasses[size].replace("border-", "border-")} 
          absolute rounded-full border-dashed border-opacity-20 
          border-gray-200 -m-[5px]`}
        ></div>
      </div>
    </div>
  );
};

export const PageLoader = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-600 to-violet-900 bg-opacity-80 z-50 flex flex-col items-center justify-center gap-4">
    <GradientLoader size="lg" />
    <p className="text-white font-medium text-lg animate-pulse">Loading...</p>
  </div>
);

export default GradientLoader;
