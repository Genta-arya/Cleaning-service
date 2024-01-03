import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkJwt, handleLogin } from "../../../../Service/Api";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  setLoggedIn,
  setRole,
} from "../../../../Feature/Redux/Auth/AuthSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { ClipLoader, PulseLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkLoginStatus } from "../../../../Service/CheckAuth";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { signInWithGoogle } from "../../../../Feature/Firebase/FirebaseAuth";
import logo from "../../../../Asset/wayan logo.png";
import { motion } from "framer-motion";
import ForgotPasswordModal from "./ForgotPasswordModa";
import Copyright from "../Home/Component/Copyright";

const apiUrl = process.env.REACT_APP_API_URL;
const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(!isForgotPasswordModalOpen);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
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
        if (checkJwtResponse.role === "user") {
          navigate("/");
        } else if (checkJwtResponse.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          console.error("Unexpected role:", checkJwtResponse.role);
        }
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

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      const result = await signInWithGoogle();
      setIsLoading(true);

      const response = await fetch(`${apiUrl}/login-google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      });
      setIsLoading(true);

      const data = await response.json();

      if (data.success) {
        dispatch(setLoggedIn(true));
        dispatch(setRole(data.role));
        navigate("/");
      } else {
        toast.error("Login failed: " + data.error);
      }
    } catch (error) {
      console.error("Google Login Error:", error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <PulseLoader color="#ffffff" size={25} loading={true} />
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full p-6 bg-white rounded-md shadow-md"
      >
        <div
          className="flex justify-start items-center gap-3 cursor-pointer"
          onClick={Handleback}
        >
          <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
          <span className="text-sm">Kembali</span>
        </div>
        <h2 className="text-2xl font-semibold mb-4 mt-4">Login</h2>
        <img
          src={logo}
          alt="Logo"
          className="mx-auto mb-6"
          style={{ maxWidth: "100px" }}
        />

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
          <div className="mb-4 -z-0 relative">
   
              <label htmlFor="password" className="block text-gray-700  ">
                Password:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              />
    
            <div
              className="absolute top-11 transform -translate-y-1/2 right-3 cursor-pointer"
              onClick={handleTogglePassword}
            >
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="text-gray-500"
              />
            </div>
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
            className="bg-biru text-white py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue w-full mt-4"
          >
            Login
          </button>
          <h1
            className="flex justify-center text-gray-500 text-sm mt-2 hover:underline cursor-pointer"
            onClick={toggleForgotPasswordModal}
          >
            Lupa password
          </h1>
          {isForgotPasswordModalOpen && (
            <ForgotPasswordModal
              isOpen={isForgotPasswordModalOpen}
              onClose={toggleForgotPasswordModal}
            />
          )}
          <div className="my-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center w-full">
                <div className="flex-grow border-t border-gray-300"></div>
                <div className="mx-4 text-gray-500">atau</div>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
            </div>
          </div>

          <button
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:shadow-outline-red w-full "
            onClick={handleGoogleLogin}
          >
            <FontAwesomeIcon icon={faGoogle} className="mr-2" />
            Login dengan Google
          </button>
        </form>
      </motion.div>
      <ToastContainer />
    </motion.div>
  );
};

export default Login;
