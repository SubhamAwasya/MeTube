import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import { HiFilm } from "react-icons/hi";
import { useUser } from "../Context";

function Navbar({ isSidebarOpen, toggleSidebar }) {
  const { user, logout } = useUser();
  const isLoggedIn = !!user;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-20">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-2xl text-gray-700 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <FiMenu />
            </button>
            <Link
              to="/"
              className="hidden md:flex items-center gap-2 text-2xl font-bold ml-4"
            >
              <HiFilm className="text-4xl text-red-600" />
              <span className="text-gray-800">MeTube</span>
            </Link>
          </div>

          {/* Middle Section */}
          <div className="flex-grow max-w-md mx-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 relative" ref={menuRef}>
            {isLoggedIn ? (
              <>
                <Link
                  to="/upload"
                  className="hidden md:block bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
                >
                  Upload
                </Link>

                {/* Avatar + Username */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center text-gray-600 hover:text-red-600 transition focus:outline-none"
                >
                  <RxAvatar className="text-3xl" />
                  <span className="ml-2 font-medium">{user.username}</span>
                </button>

                {/* Dropdown menu */}
                {menuOpen && (
                  <div className="absolute right-0 top-14 w-48 bg-white border rounded-lg shadow-lg z-30">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/auth"
                className="h-10 w-24 text-center bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
