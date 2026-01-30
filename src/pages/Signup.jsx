import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RoundedLoader from "../components/RoundedLoader";
import { useDispatch } from "react-redux";
import { useSignupMutation } from "../features/lists/authApi";
import { setCredentials } from "../features/auth/authSlice";

function Signup() {
  const [signup, { isLoading }] = useSignupMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const inviteId = queryParams.get("inviteId");
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return toast.error("Please fill all fields");
    }

    try {
      const result = await signup({ name, email, password, inviteId }).unwrap();
      dispatch(setCredentials({ user: result, token: result.token }));
      localStorage.setItem(
        "auth",
        JSON.stringify({ user: result, token: result.token }),
      );

      toast.success("Signup successful!");
      setTimeout(() => navigate("/home"), 400);
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(err.response?.data?.message || "Server error during signup");
    }
  };

  return (
    <>
      {isLoading ? (
        <RoundedLoader />
      ) : (
        <div className="flex items-center justify-center mt-20">
          <div className="w-full max-w-md bg-gray-200 p-6 rounded-md shadow-md">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Signup
            </h1>
            <form className="space-y-4" onSubmit={handleSignup}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={signupInfo.name}
                  autoFocus
                  placeholder="Enter your name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={signupInfo.email}
                  placeholder="Enter your email..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 "
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
                  value={signupInfo.password}
                  placeholder="Enter your password..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 "
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#39393a] hover:bg-[#2c2c2d] cursor-pointer text-white font-semibold py-2 rounded-md transition duration-200"
              >
                Signup
              </button>

              <div className="text-center text-sm text-gray-600 mt-2">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="text-gray-900 hover:text-gray-900 border-b font-medium"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Signup;
