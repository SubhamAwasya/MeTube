// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { MdHomeFilled, MdDashboard } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { FiUpload } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import { HiFilm } from "react-icons/hi";

function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const location = useLocation();

  const menuItems = [
    { name: "Home", path: "/", icon: <MdHomeFilled /> },
    { name: "Profile", path: "/profile", icon: <RxAvatar /> },
    { name: "Upload Video", path: "/upload", icon: <FiUpload /> },
    { name: "Dashboard", path: "/dashboard", icon: <MdDashboard /> },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-lg border-r transition-transform duration-300 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <span className="flex items-center gap-2 text-2xl font-bold">
          <HiFilm className="text-4xl text-red-600" /> MeTube
        </span>
        <button onClick={toggleSidebar}>
          <AiOutlineClose size={24} />
        </button>
      </div>

      <nav className="mt-4">
        <ul className="flex flex-col space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={toggleSidebar}
                className={`flex items-center gap-4 px-4 py-2 hover:bg-gray-100 transition ${
                  location.pathname === item.path
                    ? "bg-gray-200 font-semibold"
                    : ""
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
