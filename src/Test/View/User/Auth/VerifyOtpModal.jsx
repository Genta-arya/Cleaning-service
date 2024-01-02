import React, { useState } from "react";
import { verifyOTP } from "../../../../Service/Api";
import { ToastContainer, toast } from "react-toastify";

import PulseLoader from "react-spinners/PulseLoader";
import ChangePasswordModal from "./ChangePasswordModal";

const VerifyOTPModal = ({ isOpen, onClose }) => {
  const [otp, setOTP] = useState("");
  const [email, setEmail] = useState("");
  const [isOTPVerified, setOTPVerified] = useState(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] =
    useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);

      const result = await verifyOTP(otp);
      setEmail(result.email);
      setOTPVerified(true);
      openChangePasswordModal();
    } catch (error) {
      toast.error("Gagal verifikasi OTP. Mohon cek kembali OTP Anda.");
    } finally {
      setLoading(false);
    }
  };

  const openChangePasswordModal = () => {
    setChangePasswordModalOpen(true);
  };

  return (
    <>
      {isOpen && !isOTPVerified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="bg-white p-6  w-80 rounded-md z-10">
            <h2 className="text-2xl font-semibold mb-4">Verifikasi OTP</h2>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-gray-700">
                OTP:
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="cek email untuk otp mu"
                required
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleVerifyOTP}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue relative"
                disabled={isLoading}
              >
                {isLoading ? (
                  <PulseLoader color="#ffffff" size={8} margin={2} />
                ) : (
                  "Submit"
                )}
              </button>
              <button
                className="text-white py-2 px-4 w-20 items-center rounded-md bg-red-500 hover:bg-red-700  focus:outline-none"
                onClick={onClose}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {isOTPVerified && (
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setChangePasswordModalOpen(false)}
          email={email}
        />
      )}

      <ToastContainer />
    </>
  );
};

export default VerifyOTPModal;
