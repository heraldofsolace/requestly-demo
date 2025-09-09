const express = require('express');
const app = express();
app.use(express.json());

let items = [];
let idCounter = 1;

// Create
app.post('/items', (req, res) => {
  const item = { id: idCounter++, ...req.body };
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

// Update
app.put('/items/:id', (req, res) => {
  const idx = items.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  items[idx] = { ...items[idx], ...req.body };
  res.json(items[idx]);
});

// Delete
app.delete('/items/:id', (req, res) => {
  const idx = items.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  const deleted = items.splice(idx, 1);
  res.json(deleted[0]);
});

// Third-party API call to httpbin using native fetch
app.get('/httpbin', async (req, res) => {
  try {
    const response = await fetch('https://httpbin.org/get');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from httpbin', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
