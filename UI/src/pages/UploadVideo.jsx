import React, { useEffect, useState } from "react";

function UploadVideo() {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [isUploading, setIsUploading] = useState(false);

  const [videoProgress, setVideoProgress] = useState(0);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);

  // Simulate upload with setInterval
  useEffect(() => {
    if (isCancelled) return;

    const videoInterval = setInterval(() => {
      setVideoProgress((prev) => {
        if (prev >= 100) {
          clearInterval(videoInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 300);

    const thumbnailInterval = setInterval(() => {
      setThumbnailProgress((prev) => {
        if (prev >= 100) {
          clearInterval(thumbnailInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => {
      clearInterval(videoInterval);
      clearInterval(thumbnailInterval);
    };
  }, [isCancelled]);

  const cancelUpload = () => {
    setIsCancelled(true);
    setIsUploading(false);
    setVideoProgress(0);
    setThumbnailProgress(0);
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setThumbnail(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);
    console.log("Uploading video...", {
      title: e.target.title.value,
      description: e.target.description.value,
      tags: e.target.tags.value.split(",").map((tag) => tag.trim()),
      videoFile,
      thumbnail,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 flex justify-center">
      {isUploading ? (
        <div className="w-full max-w-2xl h-fit bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Uploading Video
          </h2>

          {/* Thumbnail Upload */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Uploading Thumbnail
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-blue-500 h-4 transition-all duration-300"
                style={{ width: `${thumbnailProgress}%` }}
              ></div>
            </div>
            <p className="text-right text-sm mt-1 text-gray-600">
              {thumbnailProgress}%
            </p>
          </div>

          {/* Video Upload */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Uploading Video
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-red-500 h-4 transition-all duration-300"
                style={{ width: `${videoProgress}%` }}
              ></div>
            </div>
            <p className="text-right text-sm mt-1 text-gray-600">
              {videoProgress}%
            </p>
          </div>

          {/* Cancel Button */}
          <div className="flex justify-center">
            <button
              onClick={cancelUpload}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
            >
              Cancel Upload
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl h-fit bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Upload a Video
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Title</label>
              <input
                name="title"
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Tell viewers about your video..."
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                name="tags"
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., coding, react, tutorial"
              />
            </div>

            {/* THUMBNAIL UPLOAD */}
            <div>
              <label className="block text-gray-700 mb-1">Thumbnail</label>
              <div className="relative">
                <input
                  id="thumbnailInput"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
                <label
                  htmlFor="thumbnailInput"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
                >
                  Choose Thumbnail
                </label>
              </div>
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt="Thumbnail Preview"
                  className="mt-2 w-full aspect-video object-cover rounded-lg"
                />
              )}
            </div>

            {/* VIDEO FILE UPLOAD */}
            <div>
              <label className="block text-gray-700 mb-1">Video File</label>
              <div className="relative">
                <input
                  id="videoInput"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
                <label
                  htmlFor="videoInput"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
                >
                  Choose Video
                </label>
              </div>
              {videoFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected:{" "}
                  <span className="font-medium">{videoFile.name}</span>
                </p>
              )}
              {videoFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Size:
                  <span className="font-medium">
                    {" " + (videoFile.size / (1000 * 1000)).toFixed(2)} MB
                  </span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Upload Video
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default UploadVideo;
