import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import VideoCard from "../components/VideoCard";

function SearchResults() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query"); // this gives you the text after ?query=

  const [searchVideos, setSearchVideos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API endpoint (can be moved to a constants/config file)
  const URL = {
    getSearchVideos: "http://localhost:1000/video/search?query=" + query,
  };

  // useEffect runs once on component mount
  useEffect(() => {
    setError(null);
    setLoading(true);
    // Fetch all videos from backend
    axios
      .get(URL.getSearchVideos)
      .then((response) => {
        // Save videos in state
        setSearchVideos(response.data);
      })
      .catch((error) => {
        // Handle fetch error
        console.error("Error fetching videos:", error);
        setError(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  if (error) {
    return (
      <>
        <div>{query}</div>
        <div>{error}</div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <div>{query}</div>
        <div>Loading...</div>
      </>
    );
  }

  return (
    <div className="grid youtubeGrid gap-2">
      {searchVideos.map((video) => (
        <VideoCard key={video._id} videoData={video} />
      ))}
    </div>
  );
}

export default SearchResults;
