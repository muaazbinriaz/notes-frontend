import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen ">
      <h1 className="mb-4 text-3xl  font-bold text-white">
        4️⃣0️⃣4️⃣ Page Not Found
      </h1>
      <h2 className="mb-13 text-3xl  text-white">
        This is not the page you are looking for!
      </h2>
      <Link
        to="/"
        className="border rounded-md bg-[#437993] p-2.5 text-white hover:bg-[#106189] duration-500 cursor-pointer"
      >
        Go to Login Page
      </Link>
    </div>
  );
}

export default NotFound;
