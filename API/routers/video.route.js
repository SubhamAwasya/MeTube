import { Router } from "express";
import {
  UploadVideo,
  UploadThumbnail,
  SaveVideoData,
  DeleteVideoById,
  GetAllVideos,
  GetVideoByID,
  GetVideosBySearch,
  GetMyVideos,
  LikeVideo,
  DislikeVideo,
  toggleSubscribe,
} from "../controller/video.controller.js";
import { validateToken } from "../utils/middelware.js";

const router = Router();

router.get("/get-all", GetAllVideos);
router.get("/get/:id", GetVideoByID);
router.get("/search", GetVideosBySearch);

// Protected routes
router.post("/like", validateToken, LikeVideo);
router.post("/dislike", validateToken, DislikeVideo);
router.post("/subscribe", validateToken, toggleSubscribe);
router.post("/upload-video", validateToken, UploadVideo);
router.post("/upload-thumbnail", validateToken, UploadThumbnail);
router.post("/save-video-data", validateToken, SaveVideoData);
router.delete("/delete/:id", validateToken, DeleteVideoById);
router.get("/get-my-videos/:id", validateToken, GetMyVideos);

export default router;
