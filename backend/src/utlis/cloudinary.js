import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;
    const response = await cloudinary.uploader.upload(filePath, {resource_type: "auto", folder: "auctionPlatform"});
    console.log("File uploaded successfully!");
    return response;
  } catch (error) {
    console.log("File uploading failed in cloudinary", error);
  }
};
