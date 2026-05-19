const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Naam zaroor daalein'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email zaroor daalein'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password zaroor daalein'],
    minlength: 6
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);