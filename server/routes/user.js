const router = require('express').Router();
const userController = require('../controllers/user');
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "profile_pic",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
});

const parser = multer({ storage });

router.post('/register', userController.register);
router.post('/', userController.signIn);
router.post('/google', userController.googleSignIn);
router.post('/image/:token', parser.single("image"), userController.uploadImage);
router.get('/:token', userController.getProfile);

module.exports = router;