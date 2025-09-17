const express = require('express');
const app = express();
app.use(express.json());
const axios = require('axios');

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
