const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const dotenv = require("dotenv");


dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Add to .env file
  api_key: process.env.CLOUDINARY_API_KEY,        // Add to .env file
  api_secret: process.env.CLOUDINARY_API_SECRET   // Add to .env file
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Get file extension and validate it
    const ext = file.originalname.split('.').pop().toLowerCase();
    
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      throw new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.');
    }

    return {
      folder: 'user_images', // Cloudinary folder name
      format: ext,           // File format (jpg, jpeg, png)
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}` // Unique name
    };
  },
});

const upload = multer({ storage });

module.exports = { upload };

