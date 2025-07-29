const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Debug Cloudinary config
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY ? '***' : 'MISSING',
  api_secret: process.env.CLOUD_SECRET ? '***' : 'MISSING'
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Test Cloudinary connection
cloudinary.api.ping()
  .then(result => console.log('✅ Cloudinary connected:', result))
  .catch(err => {
    console.error('❌ Cloudinary connection failed:', err.message);
    console.error('Error details:', err);
    console.log('Please check your Cloudinary credentials in .env file');
  });

module.exports = { cloudinary };
