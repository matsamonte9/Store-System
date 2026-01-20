const multer = require('multer');
const path = require('path');
const { BadRequestError } = require('../errors');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = ( req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new BadRequestError(`"Image" files only`, "image"), false);
  }
}

const uploadProductImage = multer({
  storage, 
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

module.exports = uploadProductImage;