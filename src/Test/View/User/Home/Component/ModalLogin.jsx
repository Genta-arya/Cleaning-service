import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
const ModalLogin = ({ closeModalOrder, navigate }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-96 p-6 rounded-md shadow-lg">
        <div className="flex justify-end">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={closeModalOrder}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <p className="text-gray-700 text-lg mb-4">
          Anda belum login. Silakan login untuk melanjutkan.
        </p>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalLogin;
