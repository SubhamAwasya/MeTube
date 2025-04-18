import React from "react";
import VideoCard from "../components/VideoCard.jsx";
import { dummyVideos } from "../../dummyVideos.js";

const dummyUser = {
  name: "Shubham Awasya",
  profileImage: "2.png",
  subscribers: "1.2K",
  videosCount: 5,
};

function Profile() {
  return (
    <>
      {/* Profile Card */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 p-6 bg-white rounded-xl shadow-md border border-gray-200">
        <img
          src={dummyUser.profileImage}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover hover:scale-105 transition"
        />
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold text-gray-900">{dummyUser.name}</h2>
          <p className="text-gray-600 mt-1">
            <span className="font-medium">{dummyUser.subscribers}</span>{" "}
            subscribers •{" "}
            <span className="font-medium">{dummyUser.videosCount}</span> videos
          </p>
        </div>
      </div>

      {/* Video Section */}
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Videos</h3>
      <div className="grid youtubeGrid gap-2">
        {dummyVideos.map((video) => (
          <VideoCard key={video.id} videoData={video} />
        ))}
      </div>
    </>
  );
}

export default Profile;
