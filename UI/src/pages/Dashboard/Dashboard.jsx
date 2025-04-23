import React, { useEffect, useState } from "react";
import {
  MdOutlineDashboard,
  MdVideoLibrary,
  MdBarChart,
  MdComment,
  MdSettings,
} from "react-icons/md";
import { dummyVideos } from "../../../dummyVideos";
import { FiMenu, FiX } from "react-icons/fi";
import { RiHome9Fill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../Context";
import D_VideoCard from "./Components/D_VideoCard";

const dummyStats = {
  subscribers: "1.2K",
  totalVideos: 8,
  totalViews: "120K",
};

const sidebarLinks = [
  { label: "Overview", icon: <MdOutlineDashboard /> },
  { label: "Videos", icon: <MdVideoLibrary /> },
  { label: "Analytics", icon: <MdBarChart /> },
  { label: "Comments", icon: <MdComment /> },
  { label: "Settings", icon: <MdSettings /> },
];

function Dashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`w-64 fixed lg:static z-10 min-h-screen bg-white p-4 shadow-md  ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-2xl mr-4 text-gray-700"
          >
            <FiX />
          </button>
        </div>
        <ul className="space-y-3">
          {sidebarLinks.map((link) => (
            <li
              key={link.label}
              className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-red-50 transition ${
                activeTab === link.label
                  ? "bg-red-100 text-red-600"
                  : "text-gray-700"
              }`}
              onClick={() => setActiveTab(link.label)}
            >
              {link.icon}
              <span>{link.label}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-2xl mr-4 text-gray-700"
            >
              <FiMenu />
            </button>

            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          </div>
          <Link to="/">
            <RiHome9Fill className="text-2xl text-gray-700" />
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">Subscribers</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {dummyStats.subscribers}
            </h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">Total Videos</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {dummyStats.totalVideos}
            </h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">Total Views</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {dummyStats.totalViews}
            </h3>
          </div>
        </div>

        {/* Recent Uploads */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Uploads
        </h2>

        {dummyVideos.map((video) => (
          <D_VideoCard key={video.id} videoData={video} />
        ))}
      </main>
    </div>
  );
}

export default Dashboard;
