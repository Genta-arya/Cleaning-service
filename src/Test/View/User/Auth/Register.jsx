import React, { useState } from "react";
import { handleRegister } from "../../../../Service/Api";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { ClipLoader, PulseLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../../../Asset/wayan logo.png";
import { motion } from "framer-motion";
import PasswordStrengthBar from "./bar";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [response, setResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateUsername = () => {
    return !formData.username.includes(" ");
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const getPasswordStrengthLevel = () => {
    const passwordLength = formData.password.length;

    if (passwordLength < 8) {
      return "weak";
    } else if (passwordLength > 10 && passwordLength <= 10) {
      return "medium";
    } else {
      return "strong";
    }
  };

  const getPasswordStrengthColor = () => {
    const strengthLevel = getPasswordStrengthLevel();

    switch (strengthLevel) {
      case "weak":
        return "red";
      case "medium":
        return "orange";
      case "strong":
        return "green";
      default:
        return "black";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateUsername()) {
      setErrorMsg("Username cannot contain spaces");
      toast.error("Username tidak boleh menggunakan spasi");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      toast.error("Password tidak sama");
      return;
    }

    setIsLoading(true);
    try {
      const result = await handleRegister(formData);

      setResponse(result);

      toast.success("Registration successful");
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.error);
        toast.error(error.response.data.error);
      } else {
        setErrorMsg("Internal Server Error");
        toast.error("Internal Server Error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const Handleback = () => {
    navigate("/");
  };

  const HandleLogin = () => {
    navigate("/login");
  };

  const passwordStrengthColor = getPasswordStrengthColor();

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
        <h2 className="text-2xl font-semibold mb-4 mt-4">Register</h2>
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
              placeholder="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@email.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-700">
              Password:
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="******"
              required
              value={formData.password}
              onChange={handleChange}
              className={`w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 ${passwordStrengthColor}`}
            />
            {formData.password && (
              <PasswordStrengthBar strengthColor={passwordStrengthColor} />
            )}
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
          <div className="mb-4 relative">
            <label htmlFor="confirmPassword" className="block text-gray-700">
              Confirm Password:
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="******"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
            <div
              className="absolute top-11 transform -translate-y-1/2 right-3 cursor-pointer"
              onClick={handleTogglePassword}
            ></div>
          </div>
          <button
            type="submit"
            className="bg-biru w-full text-white py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue"
          >
            Register
          </button>
          <div className="flex justify-center mt-3">
            <h1 className="text-sm text-gray-500 cursor-default">
              Sudah punya akun ?{" "}
              <span
                className="text-base font-bold text-biru cursor-pointer hover:underline"
                onClick={HandleLogin}
              >
                Login{" "}
              </span>
            </h1>
          </div>
        </form>
      </motion.div>
      <ToastContainer />
    </motion.div>
  );
};

export default Register;
