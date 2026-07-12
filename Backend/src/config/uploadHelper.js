const { cloudinary } = require('../config'); 
const fs = require('fs'); // Added: to delete temp files

// This function takes a file path from multer and uploads it to Cloudinary
const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "chatsphere_uploads",
    });
    
   
    fs.unlinkSync(filePath);


    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw error;
  }
};

module.exports = { uploadToCloudinary };