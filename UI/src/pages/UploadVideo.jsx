import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../Context";
import { useNavigate } from "react-router-dom";

function UploadVideo() {
  // State variables for file inputs
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  // Upload control states
  const [isUploading, setIsUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);

  const { user } = useUser();
  const navigate = useNavigate();

  const URL = {
    uploadVideo: "http://localhost:1000/video/upload-video",
    uploadThumbnail: "http://localhost:1000/video/upload-thumbnail",
    saveVideoData: "http://localhost:1000/video/save-video-data",
  };

  // Redirect unauthenticated users to /auth
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  // Simulated progress bar for thumbnail and video upload
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

  // Cancel button handler
  const cancelUpload = () => {
    setIsCancelled(true);
    setIsUploading(false);
    setVideoProgress(0);
    setThumbnailProgress(0);
  };

  // Handle selecting a video file
  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  // Handle selecting a thumbnail image and convert it to base64
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setThumbnail(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Upload the video file to backend and return its URL
  async function uploadVideo(setProgress) {
    const formData = new FormData();
    formData.append("video", videoFile);

    const response = await axios.post(URL.uploadVideo, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${user.token}`, // Send the token in the headers
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percent);
      },
    });

    return response.data.videoUrl;
  }
  // Upload the thumbnail to backend and return its URL
  async function uploadThumbnail(setProgress) {
    const formData = new FormData();
    formData.append("token", user.token);
    formData.append("thumbnail", dataURLtoFile(thumbnail, "thumbnail.jpg"));

    const response = await axios.post(URL.uploadThumbnail, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${user.token}`, // Send the token in the headers
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percent);
      },
    });

    return response.data.thumbnailUrl;
  }
  // Convert base64 string to File object (for thumbnail upload)
  function dataURLtoFile(dataUrl, filename) {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  // Main form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setIsCancelled(false);
    setVideoProgress(0);
    setThumbnailProgress(0);

    try {
      // Run both uploads at the same time
      const [videoLink, thumbnailLink] = await Promise.all([
        uploadVideo(setVideoProgress),
        uploadThumbnail(setThumbnailProgress),
      ]);

      axios
        .post(
          URL.saveVideoData,
          {
            title: e.target.title.value,
            description: e.target.description.value,
            tags: e.target.tags.value.split(",").map((tag) => tag.trim()),
            video: videoLink,
            thumbnail: thumbnailLink,
            userId: user.id,
          },
          {
            headers: {
              "Content-Type": "application/json", // If you're sending JSON data
              Authorization: `Bearer ${user.token}`, // Add token to Authorization header
            },
          }
        )
        .then((response) => {
          setIsUploading(false);
        })
        .catch((error) => {
          console.error("Failed to save video data:", error);
          setIsUploading(false);
        });

      // Optionally redirect or show a success message
    } catch (err) {
      console.error("Upload failed:", err);
      // Optional: show error feedback
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 rounded-sm px-4 py-8 flex justify-center">
      {/* Uploading State UI */}
      {isUploading ? (
        <div className="w-full max-w-2xl h-fit bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Uploading Video
          </h2>

          {/* Thumbnail Upload Progress */}
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

          {/* Video Upload Progress */}
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

          {/* Cancel Upload Button */}
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
        // Upload Form UI
        <div className="w-full max-w-2xl h-fit bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Upload a Video
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-gray-700 mb-1">Title</label>
              <input
                name="title"
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Tell viewers about your video..."
              ></textarea>
            </div>

            {/* Tags Input */}
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

            {/* Thumbnail Upload */}
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

            {/* Video File Upload */}
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
                <>
                  <p className="text-sm text-gray-600 mt-1">
                    Selected:{" "}
                    <span className="font-medium">{videoFile.name}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Size:
                    <span className="font-medium">
                      {" " + (videoFile.size / (1000 * 1000)).toFixed(2)} MB
                    </span>
                  </p>
                </>
              )}
            </div>

            {/* Submit Button */}
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
