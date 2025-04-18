import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

function D_VideoCard({ videoData, onEdit, onDelete }) {
  return (
    <div className="w-full flex bg-white shadow-md rounded-lg overflow-hidden mb-4">
      {/* Thumbnail */}
      <div className="max-w-64 bg-cover flex-1">
        <img
          src={videoData.thumbnails}
          alt={videoData.title}
          className="w-full rounded-lg h-full object-cover"
        />
      </div>

      {/* Video Info */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {videoData.title}
          </h2>

          {/* Views */}
          <p className="text-sm text-gray-500 mt-1">{videoData.views} views</p>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => onEdit(videoData)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition duration-200 shadow-sm"
          >
            <FaEdit className="text-base" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => onDelete(videoData)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-full hover:bg-red-700 transition duration-200 shadow-sm"
          >
            <FaTrash className="text-base" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default D_VideoCard;
