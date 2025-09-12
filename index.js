const express = require('express');
const app = express();
app.use(express.json());
const axios = require('axios');

let items = [];
let idCounter = 1;

// Helper function for item validation
function validateItem(body) {
  if (
    typeof body.title !== 'string' ||
    typeof body.price !== 'number' ||
    typeof body.description !== 'string' ||
    !Array.isArray(body.categories) ||
    !body.categories.every(cat => typeof cat === 'string') ||
    typeof body.manufacturer !== 'object' ||
    typeof body.manufacturer.name !== 'string' ||
    typeof body.manufacturer.address !== 'string'
  ) {
    return false;
  }
  return true;
}

// Create
app.post('/items', (req, res) => {
  if (!validateItem(req.body)) {
    return res.status(400).json({ error: 'Invalid item schema. Required: title (string), price (number), description (string), categories (array of strings), manufacturer (object with name and address).' });
  }
    const item = {
      id: idCounter++,
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      categories: req.body.categories,
      manufacturer: req.body.manufacturer
    };
  items.push(item);
  res.status(201).json(item);
});

// Read all
app.get('/items', (req, res) => {
  res.json(items);
});

// Read one
app.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// Add a category to an item
app.post('/items/:id/category', (req, res) => {
  const idx = items.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  const { category } = req.body;
  if (typeof category !== 'string' || !category.trim()) {
    return res.status(400).json({ error: 'Category must be a non-empty string.' });
  }
  if (!items[idx].categories.includes(category)) {
    items[idx].categories.push(category);
  }
  res.json(items[idx]);
});

// Update
app.put('/items/:id', (req, res) => {
  const idx = items.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  // Validate if updating all fields
  if (!validateItem(req.body)) {
    return res.status(400).json({ error: 'Invalid item schema. Required: title (string), price (number), description (string), categories (array of strings), manufacturer (object with name and address).' });
  }
    if("id" in req.body && req.body.id !== items[idx].id) {
    return res.status(400).json({ error: 'ID field cannot be updated.' });
  }
  items[idx] = { ...items[idx], ...req.body };
  res.json(items[idx]);
});

// PATCH - Partial update of an item
app.patch('/items/:id', (req, res) => {
  const idx = items.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });

  // Only update provided fields
  const allowedFields = ['title', 'price', 'description', 'id', 'categories', 'manufacturer'];
  const updates = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }
  items[idx] = { ...items[idx], ...updates };
  res.json(items[idx]);
});

// Delete
app.delete('/items/:id', (req, res) => {
  const idx = items.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  const deleted = items.splice(idx, 1);
  res.json(deleted[0]);
});

// Third-party API call to httpbin
app.get('/httpbin', async (req, res) => {
  try {
    const response = await axios.get('https://httpbin.org/get');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from httpbin', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
