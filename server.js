const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // ← هذا يسمح CORS
app.use(express.json());

// 🔧 هذا السطر مهم لحل مشكلة preflight
app.options('/api', cors());

const API_KEY = process.env.OPENAI_API_KEY;

app.post('/api', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
