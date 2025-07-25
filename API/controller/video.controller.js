import { User, Video } from "../models/models.js";
import multer from "multer";
import fs from "fs";
import mongoose from "mongoose";
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
    const videos = await Video.aggregate([
      {
        $sample: { size: 20 }, // Fetch 20 random videos; adjust size as needed
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $unset: "user.password", // Remove only the password field from the joined user
      },
    ]);

    res.status(200).send(videos);
  } catch (error) {
    console.error("GetAllVideos error =>", error);
    res.status(500).json({ message: "Failed to fetch videos." });
  }
  console.log("------------- GetAllVideos controller ended -------------");
};
// Controller to fetch a single video by its ID
const GetVideoByID = async (req, res) => {
  console.log("------------- GetVideoByID controller started -------------");

  try {
    const { id } = req.params;

    // ✅ Validate the ID format first
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid video ID." });
    }

    // ✅ Fetch video and populate uploader data (excluding password)
    const video = await Video.findById(id).populate({
      path: "userId",
      select: "-password",
    });

    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }

    // ✅ Format the response to match frontend expectation
    const formattedVideo = {
      ...video._doc,
      user: video.userId,
    };
    delete formattedVideo.userId;

    res.status(200).json(formattedVideo);
  } catch (error) {
    console.error("GetVideoByID error =>", error);
    res.status(500).json({ message: "Failed to fetch video." });
  }

  console.log("------------- GetVideoByID controller ended -------------");
};

// Controller to Get a single video by its ID
const GetMyVideos = async (req, res) => {
  console.log("------------- GetMyVideos controller started -------------");
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const videos = await Video.aggregate([
      // Match videos uploaded by this user
      {
        $match: {
          userId: new mongoose.Types.ObjectId(id), // Ensure it's treated as ObjectId
        },
      },
      // Sort by newest first
      {
        $sort: { createdAt: -1 },
      },
      // Join user data from users collection
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      // Flatten the user array
      {
        $unwind: "$user",
      },
      // Remove password from joined user data
      {
        $unset: "user.password",
      },
    ]);

    // Send the response
    res.status(200).json(videos);
  } catch (error) {
    console.error("GetMyVideos error =>", error);
    res.status(500).json({ message: "Failed to fetch user videos." });
  }
  console.log("------------- GetMyVideos controller ended -------------");
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
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required." });
    }

    const videos = await Video.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $unset: "user.password",
      },
    ]);

    if (videos.length === 0) {
      return res.status(404).json({ message: "No videos found." });
    }

    res.status(200).json(videos);
  } catch (error) {
    console.error("GetVideoBySearch error =>", error);
    res.status(500).json({ message: "Failed to search videos." });
  }
  console.log("------------- GetVideoBySearch controller ended -------------");
};

// Controller to like video
const LikeVideo = async (req, res) => {
  console.log("------------- LikeVideo controller started -------------");
  try {
    const { id } = req.params;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }

    video.likes += 1;
    await video.save();

    res.status(200).json({ message: "Video liked successfully." });
  } catch (error) {
    console.error("LikeVideo error =>", error);
    res.status(500).json({ message: "Failed to like video." });
  }
  console.log("------------- LikeVideo controller ended -------------");
};

// Controller to dislike video
const DislikeVideo = async (req, res) => {
  console.log("------------- DislikeVideo controller started -------------");
  try {
    const { id } = req.params;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }

    video.dislikes += 1;
    await video.save();

    res.status(200).json({ message: "Video disliked successfully." });
  } catch (error) {
    console.error("DislikeVideo error =>", error);
    res.status(500).json({ message: "Failed to dislike video." });
  }
  console.log("------------- DislikeVideo controller ended -------------");
};

// Controller to subscribe
const toggleSubscribe = async (req, res) => {
  console.log(
    "------------- Toggle Subscribe controller started -------------"
  );
  try {
    const { userId, targetUserId } = req.body;

    if (userId === targetUserId) {
      return res
        .status(400)
        .json({ message: "You cannot subscribe to yourself." });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const alreadySubscribed = user.subscriptions.includes(targetUserId);

    if (alreadySubscribed) {
      // Unsubscribe
      user.subscriptions = user.subscriptions.filter(
        (id) => id.toString() !== targetUserId
      );
      targetUser.subscribers = targetUser.subscribers.filter(
        (id) => id.toString() !== userId
      );
      targetUser.subscribersCount = Math.max(
        targetUser.subscribersCount - 1,
        0
      );

      await user.save();
      await targetUser.save();

      return res
        .status(200)
        .json({ message: "Unsubscribed successfully.", subscribed: false });
    } else {
      // Subscribe
      user.subscriptions.push(targetUserId);
      targetUser.subscribers.push(userId);
      targetUser.subscribersCount += 1;

      await user.save();
      await targetUser.save();

      return res
        .status(200)
        .json({ message: "Subscribed successfully.", subscribed: true });
    }
  } catch (error) {
    console.error("Toggle Subscribe error =>", error);
    res.status(500).json({ message: "Failed to toggle subscription." });
  }
  console.log("------------- Toggle Subscribe controller ended -------------");
};

export {
  toggleSubscribe,
  DislikeVideo,
  LikeVideo,
  UploadVideo,
  UploadThumbnail,
  SaveVideoData,
  GetAllVideos,
  GetVideoByID,
  DeleteVideoById,
  GetVideosBySearch,
  GetMyVideos,
};
