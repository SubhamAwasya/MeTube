import { Router } from "express";
import {
  UploadVideo,
  UploadThumbnail,
  SaveVideoData,
  DeleteVideoById,
  GetAllVideos,
  GetVideoByID,
  GetVideosBySearch,
} from "../controller/video.controller.js";

const router = Router();

router.post("/upload-video", UploadVideo);
router.post("/upload-thumbnail", UploadThumbnail);
router.post("/save-video-data", SaveVideoData);
router.delete("/delete/:id", DeleteVideoById);
router.get("/get-all", GetAllVideos);
router.get("/get/:id", GetVideoByID);
router.get("/search", GetVideosBySearch);

export default router;
