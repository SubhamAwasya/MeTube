// src/components/VideoCard.jsx

import { Link } from "react-router-dom"; // For navigating to individual video page
import { format } from "timeago.js"; // For formatting the date to "x time ago"

function VideoCard({ videoData }) {
  // Destructure necessary data from the video object
  const {
    _id,
    thumbnail,
    title,
    user = {}, // Fallback to empty object to avoid undefined errors
    views = 0,
    createdAt = new Date(),
  } = videoData;

  // Default avatar if user doesn't have a profile image
  const defaultUserImage = "user.png";

  return (
    <div className="w-full p-2">
      {/* Clicking the card navigates to the video detail page */}
      <Link to={`/video/${_id}`} className="block group">
        {/* Video Thumbnail */}
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={thumbnail}
            alt={title}
            className="aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Video Metadata Section */}
        <div className="flex mt-3 gap-3">
          {/* User Avatar */}
          <img
            src={user.profileImage || defaultUserImage}
            alt="avatar"
            className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"
          />

          {/* Video Text Details */}
          <div className="flex flex-col">
            {/* Video Title */}
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
              {title}
            </h3>

            {/* Channel Username */}
            <p className="text-sm text-gray-600">
              {user.username || "Unknown Creator"}
            </p>

            {/* Views and Upload Time */}
            <div className="text-sm text-gray-500">
              {views} views • {format(createdAt)}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default VideoCard;
