const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cafe-menu",
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  }
});

module.exports = multer({ storage });