import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkJwt, handleLogin } from "../../../../Service/Api";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  setLoggedIn,
} from "../../../../Feature/Redux/Auth/AuthSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ClipLoader, PulseLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await handleLogin(formData);

      localStorage.setItem("email", result.email);
      localStorage.setItem("username", result.username);
      localStorage.setItem("token", result.token);

      const checkJwtResponse = await checkJwt();

      if (checkJwtResponse.success) {
        toast.success("Login berhasil");
        navigate("/");
      } else {
        toast.error("Login gagal: Token tidak valid");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Login gagal: Terjadi kesalahan");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const HandleToRegister = () => {
    navigate("/register");
  };
  const Handleback = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <PulseLoader color="#ffffff" size={25} loading={true} />
        </div>
      )}
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        <div
          className="flex justify-start items-center gap-3 cursor-pointer"
          onClick={Handleback}
        >
          <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
          <span className="text-sm">Kembali</span>
        </div>
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-center items-center gap-4">
            <p className="text-xs text-gray-500">Belum punya akun ?</p>
            <p
              className="text-sm text-blue-700 font-semibold cursor-pointer hover:underline"
              onClick={HandleToRegister}
            >
              Daftar Disini
            </p>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue w-full mt-4"
          >
            Login
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
