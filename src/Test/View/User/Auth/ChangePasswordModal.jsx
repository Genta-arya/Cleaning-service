import React, { useState } from "react";
import { changePassword } from "../../../../Service/Api";
import { PulseLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";

const ChangePasswordModal = ({ isOpen, onClose, email }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const handleChangePassword = async () => {
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        setLoading(false);
        toast.error("Passowrd tidak sama , cek kembali ya");
        return;
      }

      await changePassword({ email, newPassword: password });

      window.location.reload();
    } catch (error) {
      setLoading(false);
      toast.error("Mohon cek dan konfirmasi kembali password kamu ya");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="bg-white p-6 w-80 rounded-md z-10">
            <h2 className="text-2xl font-semibold mb-4">Ganti Password</h2>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">
                Password Baru:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700">
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleChangePassword}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
              >
                {isLoading ? (
                  <PulseLoader color="#ffffff" size={8} margin={2} />
                ) : (
                  "Submit"
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

          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default ChangePasswordModal;
