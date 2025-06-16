const { v2: cloudinary } = require('cloudinary');
const { CLOUDINARY } = require('./index');

cloudinary.config({
  cloud_name: CLOUDINARY.CLOUD_NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET
});

module.exports = cloudinary;
