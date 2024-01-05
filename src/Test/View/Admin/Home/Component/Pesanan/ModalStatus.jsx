import React, { useState } from "react";

const ModalStatus = ({ isVisible, onClose, onSubmit, currentStatus }) => {
  const [newStatus, setNewStatus] = useState(currentStatus);
  

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(newStatus);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 ${
        isVisible ? "visible" : "hidden"
      } flex items-center justify-center z-50`}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-12 rounded-lg shadow-lg z-10 relative w-96 ">
        <span
          className="absolute top-2 right-4 cursor-pointer"
          onClick={onClose}
        >
          &times;
        </span>
        <label className="block text-lg font-semibold mb-2" htmlFor="newStatus">
          Update Status Pesanan:
        </label>
        <div className="relative">
          <select
            id="newStatus"
            onChange={handleStatusChange}
            className="select select-info w-full max-w-xs"
          >
            {" "}
            <option
              className="capitalize text-green-500 font-bold"
              disabled
              selected
            >
              {currentStatus}
            </option>
            {currentStatus !== "pending" && (
              <option value="pending">Pending</option>
            )}
            {currentStatus !== "konfirmasi" && (
              <option value="konfirmasi">Konfirmasi</option>
            )}
            {currentStatus !== "selesai" && (
              <option value="selesai">Selesai</option>
            )}
          </select>
        </div>
        <div className="flex justify-center mt-8 ">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalStatus;
