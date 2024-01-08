import React, { useEffect, useState } from "react";
import { resetPassword } from "../../../../../../Service/Api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "./Loading";
import { ToastContainer, toast } from "react-toastify";

const ModalEditPassword = ({ onClose, select }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {}, [newPassword, confirmPassword]);

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      if (!select || !newPassword || !confirmPassword) {
        setError("Form tidak boleh kosong");
        setIsLoading(false);
        return;
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!passwordRegex.test(newPassword)) {
        setError(
          "Kata sandi harus berisi minimal satu huruf besar, satu digit, dan panjang minimal 6 karakter."
        );
        setIsLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Konfrimasi Password Tidak sama");
        setIsLoading(false);
        return;
      }

      const response = await resetPassword(select, newPassword);

      if (response.success) {
        setIsSuccess(true);
        setError(null);
        setIsLoading(false);
        onClose();
        toast.success("Password Berhasil diganti");
      } else {
        setIsSuccess(false);
        setIsLoading(false);
        setError(response.error || "Password reset failed.");
      }
    } catch (error) {
      setIsSuccess(false);
      setError("An error occurred while resetting the password.");
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AnimatePresence>
      <motion.dialog className="modal fixed z-10 inset-0 overflow-y-auto" open>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <motion.div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <motion.div
              className="bg-blue-500 p-4 flex justify-between items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl font-bold text-white">Password Reset</h2>
              <button onClick={onClose} className="text-white">
                &times;
              </button>
            </motion.div>
            <motion.div className="p-6">
              {isSuccess && (
                <p className="text-green-600 mb-4">
                  Password Berhasil Diganti!
                </p>
              )}
              {error && <p className="text-red-600 mb-4">{error}</p>}

              <motion.label
                className="block mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <span className="text-gray-700">New Password:</span>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500 pr-10"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700 cursor-pointer">
                    {showPassword ? (
                      <FaEyeSlash
                        onClick={toggleShowPassword}
                        className="h-5 w-5"
                      />
                    ) : (
                      <FaEye onClick={toggleShowPassword} className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </motion.label>

              <motion.label
                className="block mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <span className="text-gray-700">Confirm Password:</span>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500 pr-10"
                  />
                </div>
              </motion.label>

              <motion.button
                onClick={handleResetPassword}
                className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 focus:outline-none flex justify-center w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
               Reset Password
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.dialog>
      {loading && <Loading />}
      <ToastContainer />
    </AnimatePresence>
  );
};

export default ModalEditPassword;
