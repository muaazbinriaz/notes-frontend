// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import RoundedLoader from "../components/RoundedLoader";
// import { useLoginMutation } from "../features/lists/authApi";
// import { setCredentials } from "../features/auth/authSlice";
// import { useDispatch } from "react-redux";

// function Login() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [login, { isLoading }] = useLoginMutation();
//   const [loginInfo, setLoginInfo] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLoginInfo((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { email, password } = loginInfo;

//     if (!email || !password) {
//       return toast.error("Please fill all fields");
//     }

//     try {
//       const result = await login({ email, password }).unwrap();
//       dispatch(setCredentials({ user: result, token: result.token }));
//       localStorage.setItem(
//         "auth",
//         JSON.stringify({ user: result, token: result.token }),
//       );

//       toast.success("Login successful!");
//       setTimeout(() => navigate("/home"), 200);
//     } catch (err) {
//       console.error("Login error:", err);
//       toast.error(err.response?.data?.message || "Server error during login");
//     }
//   };

//   return (
//     <>
//       {isLoading ? (
//         <RoundedLoader />
//       ) : (
//         <div className="flex items-center justify-center mt-24 ">
//           <div className="w-full max-w-md bg-gray-200 p-6 rounded-md shadow-lg">
//             <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
//               Login
//             </h1>
//             <form className="space-y-4" onSubmit={handleLogin}>
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-700 mb-1 "
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   onChange={handleChange}
//                   value={loginInfo.email}
//                   autoFocus
//                   placeholder="Enter your email..."
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 "
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   onChange={handleChange}
//                   value={loginInfo.password}
//                   placeholder="Enter your password..."
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 "
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-[#39393a] cursor-pointer hover:bg-[#222223] text-white font-semibold py-2 rounded-md transition duration-200"
//               >
//                 Login
//               </button>

//               <div className="text-center text-sm text-gray-600 mt-2">
//                 Don't have an account?{" "}
//                 <Link
//                   to="/signup"
//                   className="text-gray-900 hover:text-gray-950 border-b font-medium"
//                 >
//                   Signup
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Login;

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import RoundedLoader from "../components/RoundedLoader";
import {
  useLoginMutation,
  useAcceptInviteMutation,
} from "../features/lists/authApi";
import { setCredentials } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const [acceptInvite] = useAcceptInviteMutation();

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const queryParams = new URLSearchParams(location.search);
  const inviteId = queryParams.get("inviteId");

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
      const result = await login({ email, password }).unwrap();

      const user = { _id: result._id, name: result.name, email: result.email };
      dispatch(setCredentials({ user, token: result.token }));
      localStorage.setItem(
        "auth",
        JSON.stringify({ user, token: result.token }),
      );

      if (inviteId) {
        try {
          const inviteResult = await acceptInvite({ inviteId }).unwrap();
          toast.success("Joined the board!");
          // Optional: redirect to the board page if backend returns boardId
          if (inviteResult.boardId) {
            navigate(`/home/${inviteResult.boardId}`);
            return;
          }
        } catch (err) {
          console.error("Invite acceptance failed:", err);
          toast.error("Failed to accept board invite");
        }
      }

      toast.success("Login successful!");
      setTimeout(() => navigate("/home"), 200);
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.data?.message || "Server error during login");
    }
  };

  return (
    <>
      {isLoading ? (
        <RoundedLoader />
      ) : (
        <div className="flex items-center justify-center mt-24 ">
          <div className="w-full max-w-md bg-gray-200 p-6 rounded-md shadow-lg">
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
                  autoFocus
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
                  value={loginInfo.password}
                  placeholder="Enter your password..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 "
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#39393a] cursor-pointer hover:bg-[#222223] text-white font-semibold py-2 rounded-md transition duration-200"
              >
                Login
              </button>

              <div className="text-center text-sm text-gray-600 mt-2">
                Don't have an account?{" "}
                <Link
                  to="/signup"
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
