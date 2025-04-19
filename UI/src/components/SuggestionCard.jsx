import { Link } from "react-router-dom";
import { format } from "timeago.js";

function SuggestionCard({ videoData }) {
  const { thumbnail, title, user, views, createdAt, _id } = videoData;
  return (
    <Link to={`/video/${_id}`} className="flex gap-3 mb-4 cursor-pointer">
      <img
        src={thumbnail}
        alt="video thumbnail"
        className="w-44 h-24 min-w-44 aspect-video rounded-lg object-cover"
      />
      <div className="flex flex-col text-sm text-gray-800 ">
        <h3 className="font-medium line-clamp-2">{title}</h3>
        <p className="text-xs text-gray-600 ">{user?.username}</p>
        <p className="text-xs text-gray-600 ">
          {views} • {format(createdAt)}
        </p>
      </div>
    </Link>
  );
}

export default SuggestionCard;
