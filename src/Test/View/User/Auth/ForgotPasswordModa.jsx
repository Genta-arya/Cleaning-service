import React, { useState } from "react";
import { generateOTP } from "../../../../Service/Api";
import { ToastContainer, toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import VerifyOTPModal from "./VerifyOtpModal";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [isOTPModalOpen, setOTPModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleGenerateOTP = async () => {
    try {
      setLoading(true);

      const result = await generateOTP(email);

      if (result.success) {
        setOTPModalOpen(true);
        toast.success("OTP sudah dikirimkan ke email kamu ya");
      } else {
        toast.error("Gagal mengirim OTP. Mohon cek kembali alamat email Anda.");
      }
    } catch (error) {
      console.error("Generate OTP error:", error);
      toast.error("Gagal mengirim OTP. Mohon cek kembali alamat email Anda.");
    } finally {
      setLoading(false);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="bg-white p-6 rounded-md z-10 w-80">
        <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="email@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={handleGenerateOTP}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue relative"
            disabled={isLoading}
          >
            {isLoading ? (
              <PulseLoader color="#ffffff" size={8} margin={2} />
            ) : (
              "Kirim OTP"
            )}
          </button>
          <button
            className="text-white py-2 px-4 w-24 items-center rounded-md bg-red-500 hover:bg-red-700  focus:outline-none"
            onClick={onClose}
          >
            Batal
          </button>
        </div>
      </div>

      <VerifyOTPModal
        isOpen={isOTPModalOpen}
        onClose={() => setOTPModalOpen(false)}
      />
    </div>
  ) : null;
};

export default ForgotPasswordModal;
