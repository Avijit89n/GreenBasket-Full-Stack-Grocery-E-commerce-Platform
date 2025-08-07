import { v2 as cloudinary } from "cloudinary";
import ApiError from "../Utils/ApiError.js";
import fs from "fs";



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const getPublicIdFromUrl = (url) => {
    const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
    return match ? match[1] : null; 
};


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return;
        const result = await cloudinary.uploader.upload(localFilePath,
            {
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
                resource_type: "auto"
            }

        );
        fs.unlinkSync(localFilePath);
        console.log("Uploaded to Cloudinary successfully:", result);
        return result;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.error("Error uploading to Cloudinary:", error);
        throw new ApiError(500, "Error uploading to Cloudinary");
    }
};



const deleteFromCloudinary = async (url) => {
    try {
        const publicId = getPublicIdFromUrl(url);
        if (!publicId) {
            throw new ApiError(400, "Invalid Cloudinary URL");
        }

        const result = await cloudinary.uploader.destroy(publicId, {invalidate: true});
        console.log("Deleted from Cloudinary successfully:", result);
        return result;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        throw new ApiError(500, "Error deleting from Cloudinary");
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };