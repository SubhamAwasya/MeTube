import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routers/user.route.js";
import authRouter from "./routers/auth.route.js";
import videoRouter from "./routers/video.route.js";
import commentRouter from "./routers/comment.route.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 1000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// User routes
app.use("/user", userRouter);

// Auth routes
app.use("/auth", authRouter);

// Video routes
app.use("/video", videoRouter);

// Comment routes
app.use("/comment", commentRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to MongoDB");
  });
});
