const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title zaroor daalein'],
    trim: true
  },
  content: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['Personal', 'Study', 'Work', 'Ideas'],
    default: 'Personal'
  },
  pinned: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);