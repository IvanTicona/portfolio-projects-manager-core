require('dotenv').config();

module.exports = {
  APP: {
    PORT: parseInt(process.env.PORT, 10) || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    FRONTEND_URL: process.env.FRONTEND_URL,
  },
  DB: {
    URI: process.env.MONGODB_URI
  },
  JWT: {
    SECRET: process.env.JWT_SECRET,
    COOKIE_NAME: process.env.COOKIE_NAME || 'token'
  },
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET
  }
};
