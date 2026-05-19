const express = require('express');
const Note    = require('../models/Note');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Sab routes protected hain
router.use(protect);

// ─── GET ALL NOTES ──────────────────────────────────────
// GET /api/notes
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;

    let filter = { userId: req.user._id };

    // Search filter
    if (search) {
      filter.$or = [
        { title:   { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      filter.category = category;
    }

    const notes = await Note.find(filter)
      .sort({ pinned: -1, updatedAt: -1 }); // pinned pehle, phir latest

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── CREATE NOTE ────────────────────────────────────────
// POST /api/notes
router.post('/', async (req, res) => {
  try {
    const { title, content, category, pinned } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title zaroor daalein' });
    }

    const note = await Note.create({
      userId: req.user._id,
      title,
      content: content || '',
      category: category || 'Personal',
      pinned: pinned || false
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── UPDATE NOTE ────────────────────────────────────────
// PUT /api/notes/:id
router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note nahi mili' });
    }

    // Sirf apni note edit kar sakta hai
    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Yeh note aapki nahi hai' });
    }

    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── DELETE NOTE ────────────────────────────────────────
// DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note nahi mili' });
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Yeh note aapki nahi hai' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note delete ho gai ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;