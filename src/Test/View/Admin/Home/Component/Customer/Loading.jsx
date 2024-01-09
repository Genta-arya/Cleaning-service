import React, { useEffect, useRef } from "react";
import { RingLoader } from "react-spinners";
import "./Style.css"; // Import the CSS file for styling

const Loading = () => {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-52 text-center">
        <div className="flex justify-center mt-2">
          <RingLoader color="#5F93C0" className="text-xl mb-4" />
        </div>
        <p className="text-sm text-biru font-bold loading-text">
          Tunggu sebentar yaa
        </p>
      </div>
    </div>
  );
};

export default Loading;
