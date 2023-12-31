import React from "react";

const SkeletonRow = () => {
  return (
    <tr>
      <td className="border border-gray-300 p-2">
        <div className="skeleton skeleton-line w-16 h-4"></div>
      </td>
      <td className="border border-gray-300 p-2">
        <div className="skeleton skeleton-line w-16 h-4"></div>
      </td>
      <td className="border border-gray-300 p-2">
        <div className="skeleton skeleton-line w-32 h-4"></div>
      </td>
      <td className="border border-gray-300 p-2">
        <div className="skeleton skeleton-line w-16 h-4"></div>
      </td>
      <td className="border border-gray-300 p-2">
        <div className="skeleton skeleton-line w-16 h-4"></div>
      </td>
      <td className="border border-gray-300 p-2">
        <div className="skeleton skeleton-line w-24 h-4"></div>
      </td>
    </tr>
  );
};

export default SkeletonRow;
