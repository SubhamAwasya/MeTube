import { Router } from "express";
import { GetUserByID } from "../controller/user.controller.js";

const router = Router();

router.get("/:id", GetUserByID);

export default router;
