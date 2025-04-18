import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai"; // Home icon from react-icons

function NotFound404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      {/* 404 Header */}
      <h1 className="text-6xl font-extrabold text-red-600 mb-4">404</h1>

      {/* Message */}
      <p className="text-xl text-gray-700 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>

      {/* Home Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300"
      >
        <AiOutlineHome size={24} />
        <span className="text-lg font-semibold">Go to Home</span>
      </Link>
    </div>
  );
}

export default NotFound404;
