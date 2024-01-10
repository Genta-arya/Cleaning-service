import React, { useState } from "react";
import { postDesct } from "../../../../../../Service/Api";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../Customer/Loading";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { deltaToHtml } from "delta-to-html";
const ModalPostKeterangan = ({ uuid, closeModalKet }) => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePostDescription = async () => {
    setLoading(true);
    try {
      await postDesct(uuid, description);

      toast.success("Keterangan Berhasil dikirim");
      setLoading(false);
      closeModalKet();
    } catch (error) {
      toast.error("Error posting description:", error);
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 overflow-y-auto`}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="relative bg-white p-8 rounded-md shadow-md w-[70%] lg:w-[50%]">
          <button
            onClick={closeModalKet}
            className="absolute top-0 right-0 p-4 focus:outline-none"
          >
            <svg
              className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>

          <h2 className="text-2xl font-bold mb-4">Input Keterangan Service</h2>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            className="h-72 mb-12"
          />
          <button
            onClick={handlePostDescription}
            className="bg-blue-500 text-white p-2 rounded-md cursor-pointer w-full"
          >
            Submit
          </button>
        </div>
      </div>
      {loading && <Loading />}
      <ToastContainer />
    </div>
  );
};

export default ModalPostKeterangan;
