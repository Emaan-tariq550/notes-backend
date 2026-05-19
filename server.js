const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes  = require('./routes/auth');
const notesRoutes = require('./routes/notes');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://notes-backend-rosy-five.vercel.app/api'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth',  authRoutes);
app.use('/api/notes', notesRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Notes API chal rahi hai ✅' });
});

// MongoDB connect + server start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });