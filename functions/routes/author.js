const express = require('express');
const AuthorModel = require('../models/author');

const router = express.Router();

// GET all authors
router.get('/', async (req, res) => {
  try {
    const authors = await AuthorModel.find();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to fetch an author
async function getAuthor(req, res, next) {
  let author;
  try {
    author = await AuthorModel.findById(req.params.id);
    if (author == null) {
      return res.status(404).json({ message: 'Cannot find author' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.author = author;
  next();
}

// GET a single author
router.get('/:id', getAuthor, (req, res) => {
  res.json(res.author);
});

// CREATE an author
router.post('/', async (req, res) => {
  try {
    // Validate request body
    if (!req.body.name || !req.body.age) {
      return res.status(400).json({ message: 'Name and age are required' });
    }

    // Check if the author's name already exists
    const existingAuthor = await AuthorModel.findOne({ name: req.body.name });
    if (existingAuthor) {
      return res.status(400).json({ message: 'Author already exists' });
    }

    const author = new AuthorModel(req.body);
    const newAuthor = await author.save();
    res.status(201).json({ message: 'Author created successfully', author: newAuthor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE an author
router.patch('/:id', getAuthor, async (req, res) => {
  if (req.body.name != null) {
    res.author.name = req.body.name;
  }
  // Add other fields as needed
  try {
    const updatedAuthor = await res.author.save();
    res.json(updatedAuthor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', getAuthor, async (req, res) => {
  try {
    const updateAuthor = await AuthorModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updateAuthor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
