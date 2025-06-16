const mongoose = require('mongoose');
const { DB } = require('./index');

const connectDB = async () => {
  try {
    await mongoose.connect(DB.URI);
    console.log('✅ MongoDB conectado');
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
  }
};

module.exports = connectDB;
