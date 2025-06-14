// ===== Gemini API Server (متوافق مع Render) =====
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// مفتاح Gemini من environment variables في Render
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/api', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // استخراج الرد من النموذج
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'رد غير مفهوم';
    res.json({ text });

  } catch (err) {
    console.error("💥 خطأ في API:", err.response?.data || err.message);
    res.status(500).json({ error: err.toString() });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Gemini server شغال على المنفذ ${port}`);
});
