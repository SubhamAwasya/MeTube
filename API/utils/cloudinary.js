import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload a video file to Cloudinary
const uploadVideoToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      resource_type: "video",
      folder: "videos",
    });
    return result;
  } catch (error) {
    console.error("Cloudinary video upload error:", error);
    throw error;
  }
};

// Upload an image file to Cloudinary
const uploadImageToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      resource_type: "image",
      folder: "images",
    });
    return result;
  } catch (error) {
    console.error("Cloudinary image upload error:", error);
    throw error;
  }
};

export { uploadVideoToCloudinary, uploadImageToCloudinary };
