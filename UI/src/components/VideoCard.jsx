// src/components/VideoCard.jsx
import { Link } from "react-router-dom";

function VideoCard({ videoData }) {
  const { id, thumbnails, title, userId, views, uploadedAt } = videoData;

  const userImage = "2.png";

  return (
    <div className="w-full p-2">
      <Link to={`/video/${id}`} className="block group">
        {/* Thumbnail */}
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={thumbnails}
            alt={title}
            className=" aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Video Info */}
        <div className="flex mt-3 gap-3">
          {/* Avatar Placeholder */}
          <img
            src={userImage}
            className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"
          />

          {/* Text Info */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600">{userId}</p>
            <div className="text-sm text-gray-500">
              {views} views • {uploadedAt}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default VideoCard;
