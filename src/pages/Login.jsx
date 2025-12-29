import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

function Login({ fetchNotes }) {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return toast.error("Please fill all fields");
    }

    try {
      const url = `${import.meta.env.VITE_BASE_URL}/api/website/auth/login`;
      const response = await axios.post(url, { email, password });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        toast.success("Login successful!");

        if (typeof fetchNotes === "function") {
          fetchNotes();
        }

        setTimeout(() => navigate("/home"), 200);
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Server error during login");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center mt-24 ">
        <div className="w-full max-w-md bg-gray-100 p-6 rounded-md shadow-lg">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h1>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1 "
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={loginInfo.email}
                placeholder="Enter your email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#437993]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={loginInfo.password}
                placeholder="Enter your password..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#437993]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#437993] hover:bg-[#347494] text-white font-semibold py-2 rounded-md transition duration-200"
            >
              Login
            </button>

            <div className="text-center text-sm text-gray-600 mt-2">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#437993] hover:text-[#036494] border-b font-medium"
              >
                Signup
              </Link>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;
