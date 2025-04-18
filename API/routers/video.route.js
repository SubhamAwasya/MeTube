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
} from "../controller/video.controller.js";
import { validateToken } from "../utils/middelware.js";

const router = Router();

router.post("/upload-video", validateToken, UploadVideo);
router.post("/upload-thumbnail", validateToken, UploadThumbnail);
router.post("/save-video-data", validateToken, SaveVideoData);
router.delete("/delete/:id", validateToken, DeleteVideoById);
router.get("/get-my-videos/:id", validateToken, GetMyVideos);
router.get("/get-all", GetAllVideos);
router.get("/get/:id", GetVideoByID);
router.get("/search", GetVideosBySearch);

export default router;
