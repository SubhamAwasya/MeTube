import React from "react";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FiShare } from "react-icons/fi";

const dummyVideo = {
  title: "How to build a YouTube Clone in React",
  views: "120K views",
  uploadedAt: "2 days ago",
  description:
    "In this tutorial, we'll build a full-featured YouTube clone using React and Tailwind CSS.",
  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  channel: {
    name: "Code with Shubham",
    subscribers: "1.5M subscribers",
    avatar: "https://via.placeholder.com/48",
  },
};

const suggestedVideos = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `Suggested Video ${i + 1}`,
  thumbnail: "https://via.placeholder.com/320x180",
  channel: "Channel Name",
  views: `${10 + i}K views`,
}));

function VideoPlayer() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-screen">
      {/* Left Section */}
      <div className="flex-1">
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
          <video src={dummyVideo.videoUrl} controls className="w-full h-full" />
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {dummyVideo.title}
        </h1>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="flex items-center gap-4">
            <img
              src={dummyVideo.channel.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-800">
                {dummyVideo.channel.name}
              </h3>
              <p className="text-sm text-gray-500">
                {dummyVideo.channel.subscribers}
              </p>
            </div>
            <button className="ml-4 bg-red-600 text-white px-4 py-1 rounded-full hover:bg-red-700">
              Subscribe
            </button>
          </div>

          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <button className="flex items-center gap-1 text-gray-700 hover:text-black">
              <AiOutlineLike size={20} />
              <span>12K</span>
            </button>
            <button className="flex items-center gap-1 text-gray-700 hover:text-black">
              <AiOutlineDislike size={20} />
            </button>
            <button className="flex items-center gap-1 text-gray-700 hover:text-black">
              <FiShare size={20} />
              <span>Share</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {dummyVideo.description}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {dummyVideo.views} • {dummyVideo.uploadedAt}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Comments</h2>
          <p className="text-sm text-gray-600">
            Comments section coming soon...
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Suggested Videos
        </h3>
        <div className="space-y-4">
          {suggestedVideos.map((video) => (
            <div key={video.id} className="flex gap-3">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-32 h-20 object-cover rounded"
              />
              <div className="flex flex-col justify-between">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">
                  {video.title}
                </h4>
                <p className="text-xs text-gray-500">{video.channel}</p>
                <p className="text-xs text-gray-500">{video.views}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
