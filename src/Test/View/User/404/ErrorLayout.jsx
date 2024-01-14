import React from "react";
import image from "../../../../Asset/lost.webp";
const ErrorLayout = () => {
  return (
    <div>
      <div>
        <img src={image} alt="error" />
        <p className="text-red-500 font-bold text-lg flex justify-center">
          Terjadi Kesalahan Pada Server
        </p>
      </div>
    </div>
  );
};

export default ErrorLayout;
