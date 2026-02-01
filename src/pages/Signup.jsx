import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import RoundedLoader from "../components/RoundedLoader";
import { useDispatch } from "react-redux";
import { useSignupMutation } from "../features/lists/authApi";
import { setCredentials } from "../features/auth/authSlice";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signup, { isLoading }] = useSignupMutation();
  const [searchParams] = useSearchParams();
  const inviteId = searchParams.get("inviteId");
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  useEffect(() => {
    if (inviteId) {
      toast.info("signup to join a board!", {
        autoClose: 2000,
      });
    }
  }, [inviteId]);
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
    if (password.length < 4) {
      return toast.error("Password must be at least 4 characters");
    }
    try {
      const result = await signup({
        name,
        email,
        password,
        inviteId,
      }).unwrap();
      dispatch(setCredentials({ user: result, token: result.token }));
      localStorage.setItem(
        "auth",
        JSON.stringify({ user: result, token: result.token }),
      );
      if (inviteId) {
        toast.success("Account created! You've been added to the board!");
      } else {
        toast.success("Signup successful!");
      }
      setTimeout(() => {
        navigate("/boards");
      }, 200);
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage =
        err?.data?.message ||
        err?.response?.data?.message ||
        "Server error during signup";

      toast.error(errorMessage);
    }
  };
  return (
    <>
      {isLoading ? (
        <RoundedLoader />
      ) : (
        <div className="flex items-center justify-center mt-24">
          <div className="w-full max-w-md bg-gray-200 p-6 rounded-md shadow-lg">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              {inviteId ? "Join Board" : "Signup"}
            </h1>

            {inviteId && (
              <p className="text-sm text-center text-gray-600 mb-4">
                Create an account to accept your board invitation
              </p>
            )}

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#39393a] cursor-pointer hover:bg-[#222223] text-white font-semibold py-2 rounded-md transition duration-200"
              >
                {inviteId ? "Create Account & Join Board" : "Signup"}
              </button>
              <div className="text-center text-sm text-gray-600 mt-2">
                Already have an account?{" "}
                <Link
                  to={inviteId ? `/login?inviteId=${inviteId}` : "/login"}
                  className="text-gray-900 hover:text-gray-950 border-b font-medium"
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
