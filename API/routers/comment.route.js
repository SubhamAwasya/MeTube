import { Router } from "express";
import {
  AddComment,
  GetComments,
  DeleteComment,
} from "../controller/comment.controller.js";

const router = Router();

router.get("/get", GetComments);
router.post("/add", AddComment);
router.delete("/delete/:id", DeleteComment);

export default router;
