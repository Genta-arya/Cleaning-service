import React from "react";

const SkeletonTable = () => {
  return (
    <tr>
      <td className="py-4">
        <div className="animate-pulse bg-gray-300 h-8 w-8 rounded-full"></div>
      </td>
      <td className="py-4">
        <div className="animate-pulse bg-gray-300 h-4 w-20"></div>
      </td>
      <td className="py-4">
        <div className="animate-pulse bg-gray-300 h-4 w-16"></div>
      </td>
      <td className="py-4">
        <div className="animate-pulse bg-gray-300 h-4 w-32"></div>
      </td>
      <td className="py-4">
        <div className="animate-pulse bg-gray-300 h-4 w-16"></div>
      </td>
      <td className="py-4">
        <div className="animate-pulse bg-gray-300 h-8 w-20"></div>
      </td>
    </tr>
  );
};

export default SkeletonTable;
