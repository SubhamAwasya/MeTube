// src/pages/VideoPlayer.jsx
import React, { useEffect, useState } from "react";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FiShare } from "react-icons/fi";
import { format } from "timeago.js";
import { useParams } from "react-router-dom";
import { useUser } from "../Context.jsx";
import axios from "axios";
import SuggestionCard from "../components/SuggestionCard.jsx";
import { baseApiUrl } from "../URL.js";

function VideoPlayer() {
  const [videoData, setVideoData] = useState(null);
  const [suggestedVideos, setSuggestedVideos] = useState(null);
  const [error, setError] = useState(null);

  const { id: videoId } = useParams(); // Get video ID from route
  const { user } = useUser(); // Authenticated user

  // API endpoint (can be moved to a constants/config file)
  const URL = {
    getAllVideos: baseApiUrl + "/video/get-all",
    getVideoById: baseApiUrl + `/video/get/${videoId}`,
    Subscribe: baseApiUrl + "/video/subscribe",
  };

  useEffect(() => {
    // Only fetch if user and token exist
    axios
      .get(URL.getVideoById, {})
      .then((response) => {
        setVideoData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching video data:", error);
        setError("Failed to fetch video data.");
      });
  }, [videoId]);

  // State to store fetched videos

  // useEffect runs once on component mount
  useEffect(() => {
    // Fetch all videos from backend
    axios
      .get(URL.getAllVideos)
      .then((response) => {
        // Save setSuggestedVideos in state
        setSuggestedVideos(response.data);
      })
      .catch((error) => {
        // Handle fetch error
        console.error("Error fetching videos:", error);
        setError("Failed to fetch videos.");
      });
  }, []);

  if (error) return <div>Error: {error}</div>;

  if (!videoData) return <div>Loading...</div>;

  // Destructure after confirming videoData is not null
  const {
    video,
    title,
    description,
    views,
    user: videoUser,
    createdAt,
    likes,
    dislikes,
  } = videoData;

  const {
    username = "Unknown",
    profileImage = "user.png",
    subscribersCount = 0,
  } = videoUser || {};

  function handleSubscribe() {
    axios
      .post(
        URL.Subscribe,
        {
          userId: user._id,
          targetUserId: videoUser._id, // use `targetUserId` to match toggleSubscribe backend
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )
      .then((response) => {
        console.log("Subscription response:", response.data);
        // Optionally update UI here
      })
      .catch((error) => {
        console.error("Error subscribing:", error);
      });
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-screen">
      {/* Left Section - Video and Info */}
      <div className="flex-1">
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
          <video
            src={video}
            autoPlay
            muted
            controls
            className="w-full h-full"
          />
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          {/* Channel Info */}
          <div className="flex items-center gap-4">
            <img
              src={profileImage || "/user.png"}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-800">{username}</h3>
              <p className="text-sm text-gray-500">
                {subscribersCount} subscribers
              </p>
            </div>
            <button
              onClick={handleSubscribe}
              className="ml-4 bg-red-600 text-white px-4 py-1 rounded-full hover:bg-red-700"
            >
              Subscribe
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <button className="flex items-center gap-1 text-gray-700 hover:text-black">
              <AiOutlineLike size={20} />
              <span>{likes}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-700 hover:text-black">
              <AiOutlineDislike size={20} />
              <span>{dislikes}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-700 hover:text-black">
              <FiShare size={20} />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <p className="text-xs text-gray-500 mt-2">
            {views} views • {format(createdAt)}
          </p>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {description}
          </p>
        </div>

        {/* Placeholder for Comments */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Comments</h2>
          <p className="text-sm text-gray-600">
            Comments section coming soon...
          </p>
        </div>
      </div>

      {/* Right Section - Suggested videos (optional) */}
      <div className="w-full lg:w-80 flex-shrink-0">
        {suggestedVideos.map((video) => (
          <SuggestionCard key={video._id} videoData={video} />
        ))}
      </div>
    </div>
  );
}

export default VideoPlayer;
