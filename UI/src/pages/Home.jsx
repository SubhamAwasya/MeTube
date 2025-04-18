// src/pages/Home.jsx

import { useEffect, useState } from "react"; // Hooks for lifecycle and state
import axios from "axios"; // HTTP client to fetch video data
import VideoCard from "../components/VideoCard.jsx"; // Component to display each video

function Home() {
  // State to store fetched videos
  const [videos, setVideos] = useState(null);

  // State to handle any error during fetch
  const [error, setError] = useState(null);

  // API endpoint (can be moved to a constants/config file)
  const URL = {
    getAllVideos: "http://localhost:1000/video/get-all",
  };

  // useEffect runs once on component mount
  useEffect(() => {
    // Fetch all videos from backend
    axios
      .get(URL.getAllVideos)
      .then((response) => {
        // Save videos in state
        setVideos(response.data);
      })
      .catch((error) => {
        // Handle fetch error
        console.error("Error fetching videos:", error);
        setError("Failed to fetch videos.");
      });
  }, []);

  // Render error message if there was a problem
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Show loading while data is being fetched
  if (!videos) {
    return <div>Loading...</div>;
  }

  // Render grid of VideoCards after videos are successfully fetched
  return (
    <div className="grid youtubeGrid gap-2">
      {videos.map((video) => (
        <VideoCard key={video._id} videoData={video} />
      ))}
    </div>
  );
}

export default Home;
