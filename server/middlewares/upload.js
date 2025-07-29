const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../utils/cloudinary");

// Use Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log('Uploading to Cloudinary:', file.originalname, 'Type:', file.mimetype);
    return {
      folder: "secure-drop",
      resource_type: file.mimetype.startsWith("video") ? "video" : "image",
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('Processing file:', file.originalname, 'Type:', file.mimetype);
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});

// Error handling middleware for multer
const uploadWithErrorHandling = (req, res, next) => {
  upload.single('media')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err.message);
      return res.status(400).json({ 
        msg: 'File upload failed', 
        error: err.message 
      });
    }
    console.log('File uploaded to Cloudinary successfully:', req.file);
    next();
  });
};

module.exports = uploadWithErrorHandling;
