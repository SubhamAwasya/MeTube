import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context.jsx";
import axios from "axios";
import VideoCard from "../components/VideoCard.jsx";
import { dummyVideos } from "../../dummyVideos.js";

function Profile() {
  const [videos, setVideos] = useState(null);

  const { user } = useUser();
  const navigate = useNavigate();

  // Redirect to auth page if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }

    // Fetch user's videos from backend
    axios
      .get(`http://localhost:1000/video/get-my-videos/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Add token in Authorization header
        },
      })
      .then((response) => {
        setVideos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
      });
  }, []);

  // ✅ Entire JSX is skipped if user is not loaded yet
  if (!user) return <div>Loading...</div>;

  // ✅ Now safe to access user.profileImage, user.username, etc.
  return (
    <>
      {/* Profile Card */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 p-6 bg-white rounded-xl shadow-md border border-gray-200">
        <img
          src={user?.profileImage || "user.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover hover:scale-105 transition"
        />
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold text-gray-900">{user.username}</h2>
          <p className="text-gray-600 mt-1">
            <span className="font-medium">{user.subscribersCount}</span>
            subscribers •<span className="font-medium">
              {user.videosCount}
            </span>{" "}
            videos
          </p>
        </div>
      </div>

      {/* Video Section */}
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Videos</h3>
      <div className="grid youtubeGrid gap-2">
        {videos &&
          videos.map((video) => (
            <VideoCard key={video._id} videoData={video} />
          ))}
      </div>
    </>
  );
}

export default Profile;
