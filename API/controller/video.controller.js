import { Video } from "../models/models.js";
import multer from "multer";
import fs from "fs";
import {
  uploadVideoToCloudinary,
  uploadImageToCloudinary,
} from "../utils/cloudinary.js";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Controller to handle video upload
const UploadVideo = async (req, res) => {
  console.log("------------- UploadVideo controller started -------------");
  upload.single("video")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded." });
    }

    try {
      const result = await uploadVideoToCloudinary(req.file.path);
      console.log("Video URL:" + result);

      fs.unlinkSync(req.file.path);
      res
        .status(200)
        .json({ videoUrl: result.secure_url, publicId: result.public_id });
    } catch (error) {
      console.error("UploadVideo error =>", error);
      res.status(500).json({ message: "Video upload failed." });
    }
  });
  console.log("------------- UploadVideo controller ended -------------");
};

// Controller to handle thumbnail upload
const UploadThumbnail = async (req, res) => {
  console.log("------------- UploadThumbnail controller started -------------");
  upload.single("thumbnail")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No thumbnail image uploaded." });
    }

    try {
      const result = await uploadImageToCloudinary(req.file.path);
      fs.unlinkSync(req.file.path);
      res
        .status(200)
        .json({ thumbnailUrl: result.secure_url, publicId: result.public_id });
    } catch (error) {
      console.error("UploadThumbnail error =>", error);
      res.status(500).json({ message: "Thumbnail upload failed." });
    }
  });
  console.log("------------- UploadThumbnail controller ended -------------");
};

// Controller to save video data to MongoDB
const SaveVideoData = async (req, res) => {
  console.log("------------- SaveVideoData controller started -------------");
  try {
    console.log(req.body);
    const newVideo = new Video(req.body);

    await newVideo.save();
    res
      .status(201)
      .json({ message: "Video data saved successfully.", video: newVideo });
  } catch (error) {
    console.error("SaveVideoData error =>", error);
    res.status(500).json({ message: "Failed to save video data." });
  }
  console.log("------------- SaveVideoData controller ended -------------");
};

// Controller to fetch all videos
const GetAllVideos = async (req, res) => {
  console.log("------------- GetAllVideos controller started -------------");
  try {
    // Retrieve all videos from the database and sort by creation date (latest first)
    const videos = await Video.find().sort({ createdAt: -1 });

    // Respond with the list of videos
    res.status(200).json(videos);
  } catch (error) {
    // Handle any error that occurs during retrieval
    console.error("GetAllVideos error =>", error);
    res.status(500).json({ message: "Failed to fetch videos." });
  }
  console.log("------------- GetAllVideos controller ended -------------");
};

// Controller to fetch a single video by its ID
const GetVideoByID = async (req, res) => {
  console.log("------------- GetVideoByID controller started -------------");
  try {
    // Extract video ID from request parameters
    const { id } = req.params;

    // Find the video by ID
    const video = await Video.findById(id);
    if (!video) {
      // If video not found, respond with 404
      return res.status(404).json({ message: "Video not found." });
    }

    // Respond with the found video
    res.status(200).json(video);
  } catch (error) {
    // Handle any error that occurs during retrieval
    console.error("GetVideoByID error =>", error);
    res.status(500).json({ message: "Failed to fetch video." });
  }
  console.log("------------- GetVideoByID controller ended -------------");
};

// Controller to delete a video by its ID
const DeleteVideoById = async (req, res) => {
  console.log("------------- DeleteVideoById controller started -------------");
  try {
    // Extract video ID from request parameters
    const { id } = req.params;

    // Attempt to find and delete the video by ID
    const deletedVideo = await Video.findByIdAndDelete(id);
    if (!deletedVideo) {
      // If video not found, respond with 404
      return res.status(404).json({ message: "Video not found." });
    }

    // Respond with a success message
    res.status(200).json({ message: "Video deleted successfully." });
  } catch (error) {
    // Handle any error that occurs during deletion
    console.error("DeleteVideoById error =>", error);
    res.status(500).json({ message: "Failed to delete video." });
  }
  console.log("------------- DeleteVideoById controller ended -------------");
};

// Controller to search videos by title or description
const GetVideosBySearch = async (req, res) => {
  console.log(
    "------------- GetVideoBySearch controller started -------------"
  );
  try {
    // Extract search query from request query parameters
    const { query } = req.query;

    // Perform a case-insensitive search on title or description fields
    const videos = await Video.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    // Respond with the matched videos
    res.status(200).json(videos);
  } catch (error) {
    // Handle any error that occurs during search
    console.error("GetVideoBySearch error =>", error);
    res.status(500).json({ message: "Failed to search videos." });
  }
  console.log("------------- GetVideoBySearch controller ended -------------");
};

export {
  UploadVideo,
  UploadThumbnail,
  SaveVideoData,
  GetAllVideos,
  GetVideoByID,
  DeleteVideoById,
  GetVideosBySearch,
};
