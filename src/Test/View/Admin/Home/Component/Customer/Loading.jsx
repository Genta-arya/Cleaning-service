import React from "react";
import { PulseLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg">
        <div className="flex justify-center">
          <PulseLoader color="#5F93C0" size={25} />
        </div>
        <p>Tunggu sebentar</p>
      </div>
    </div>
  );
};

export default Loading;
