import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import axios from "axios";
import { baseApiUrl } from "../URL";
import { useUser } from "../Context";

function LoginSignup() {
  const [isSignup, setIsSignup] = useState(false); // Toggle between login/signup modes

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Only used in signup mode

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Handles button disable & spinner

  const loginUrl = `${baseApiUrl}/auth/login`;
  const signupUrl = `${baseApiUrl}/auth/register`;

  const { login, user } = useUser();
  const navigate = useNavigate();

  // If already logged in, redirect to home (uncomment if needed)
  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  // Toggle login/signup mode
  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError("");
    setMessage("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      let response;
      if (isSignup) {
        // Signup API call
        response = await axios.post(signupUrl, {
          username,
          email,
          password,
        });
      } else {
        // Login API call
        response = await axios.post(loginUrl, {
          email,
          password,
        });
      }

      login(response.data.user);
      setMessage(response.data.message);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
      {/* Home Link Button */}
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center gap-1 text-red-600 hover:underline"
      >
        <AiOutlineHome size={20} />
        <span className="text-sm font-medium">Home</span>
      </Link>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {isSignup ? "Create an Account" : "Login to Your Account"}
        </h2>

        {/* Auth Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username field (only in signup mode) */}
          {isSignup && (
            <div>
              <label className="block text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="username"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`flex justify-center items-center w-full py-2 rounded-lg transition font-semibold text-white ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? (
              <>
                <span className="mr-2">Processing</span>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </>
            ) : isSignup ? (
              "Sign Up"
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Feedback messages */}
        {error && <p className="text-red-600 mt-4">{error}</p>}
        {message && <p className="text-green-600 mt-4">{message}</p>}

        {/* Switch between login and signup */}
        <p className="text-center text-sm text-gray-600 mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={toggleMode}
            className="text-red-600 hover:underline font-medium"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginSignup;
