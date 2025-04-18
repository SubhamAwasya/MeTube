// models/Video.js
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  thumbnails: { type: String, required: true },
  video: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  views: { type: String, default: "0" },
  likes: { type: String, default: "0" },
  dislikes: { type: String, default: "0" },
  uploadedAt: { type: String },
  updatedAt: { type: String },
  description: { type: String },
  duration: { type: String },
  tags: [{ type: String }],
  category: [{ type: String }],
  commentsCount: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  subscribersCount: { type: String, default: "0" },
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  profileImage: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscribersCount: { type: Number, default: 0 },
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Video = mongoose.model("Video", videoSchema);
const User = mongoose.model("User", userSchema);
const Comment = mongoose.model("Comment", commentSchema);

export { Video, User, Comment };
