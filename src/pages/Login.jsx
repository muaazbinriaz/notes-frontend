import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import RoundedLoader from "../components/RoundedLoader";
import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useAcceptInviteMutation,
} from "../features/lists/authApi";
import { clearAuth, setCredentials } from "../features/auth/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [acceptInvite, { isLoading: acceptLoading }] =
    useAcceptInviteMutation();
  const [searchParams] = useSearchParams();
  const inviteId = searchParams.get("inviteId");
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    if (inviteId) {
      toast.info("Login to accept your board invitation!", {
        autoClose: 2000,
      });
    }
  }, [inviteId]);
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
      localStorage.removeItem("auth");
      dispatch(clearAuth());
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user: result, token: result.token }));
      localStorage.setItem(
        "auth",
        JSON.stringify({ user: result, token: result.token }),
      );
      toast.success("Login successful!");
      if (inviteId) {
        try {
          const inviteResult = await acceptInvite({ inviteId }).unwrap();
          if (inviteResult.alreadyMember) {
            toast.info(
              inviteResult.message || "You are already a member of this board!",
            );
          } else {
            toast.success(
              inviteResult.message || "Successfully joined the board!",
            );
          }
          if (inviteResult.board && inviteResult.board.id) {
            setTimeout(() => {
              navigate(`/home/${inviteResult.board.id}`);
            }, 500);
          } else {
            setTimeout(() => {
              navigate("/boards");
            }, 500);
          }
        } catch (inviteErr) {
          console.error("Accept invite error:", inviteErr);
          const inviteErrorMsg =
            inviteErr?.data?.message ||
            "Could not accept invite, but you're logged in!";
          toast.warning(inviteErrorMsg);
          setTimeout(() => {
            navigate("/boards");
          }, 500);
        }
      } else {
        setTimeout(() => {
          navigate("/boards");
        }, 200);
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err?.data?.message ||
        err?.response?.data?.message ||
        "Server error during login";

      toast.error(errorMessage);
    }
  };
  const isLoading = loginLoading || acceptLoading;
  return (
    <>
      {isLoading ? (
        <RoundedLoader />
      ) : (
        <div className="flex items-center justify-center mt-24">
          <div className="w-full max-w-md bg-gray-200 p-6 rounded-md shadow-lg">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              {inviteId ? "Login to Join Board" : "Login"}
            </h1>
            {inviteId && (
              <p className="text-sm text-center text-gray-600 mb-4">
                You've been invited to join a board
              </p>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
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
                  value={loginInfo.email}
                  autoFocus
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
                  value={loginInfo.password}
                  placeholder="Enter your password..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#39393a] cursor-pointer hover:bg-[#222223] text-white font-semibold py-2 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Loading..."
                  : inviteId
                    ? "Login & Join Board"
                    : "Login"}
              </button>
              <div className="text-center text-sm text-gray-600 mt-2">
                Don't have an account?{" "}
                <Link
                  to={inviteId ? `/signup?inviteId=${inviteId}` : "/signup"}
                  className="text-gray-900 hover:text-gray-950 border-b font-medium"
                >
                  Signup
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
