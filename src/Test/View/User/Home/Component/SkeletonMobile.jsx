import React from "react";

const SkeletonMobile = () => {
  return (
    <div>
      <div className="bg-white shadow-md rounded-md p-6 mb-4 animate-pulse">
        <div className="h-4 bg-gray-300 w-1/2 mb-4"></div>
        <div className="h-24 bg-gray-300 mb-4"></div>
        <div className="h-4 bg-gray-300 w-1/2 mb-4"></div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-300 w-1/3"></div>
          <div className="h-4 bg-gray-300 w-1/4"></div>
        </div>
        <div className="flex justify-center mt-4">
          <div className="h-10 bg-gray-300 w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonMobile;
