// src/pages/Home.jsx
import VideoCard from "../components/VideoCard.jsx";

import { dummyVideos } from "../../dummyVideos.js";

function Home() {
  return (
    <div className="grid youtubeGrid gap-2">
      {dummyVideos.map((video) => (
        <VideoCard key={video.id} videoData={video} />
      ))}
    </div>
  );
}

export default Home;
