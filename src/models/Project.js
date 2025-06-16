const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: String,
  url: String,
  technologies: [String],
  image: { public_id: String, url: String }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
