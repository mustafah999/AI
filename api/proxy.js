import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt required" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key missing" });

  try {
    const g = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
      {
        contents: [
          { role: "user", parts: [{ text: prompt + "، رد بطريقة مضحكة 😆" }] }
        ]
      }
    );
    const text = g.data.candidates?.[0]?.content?.parts?.[0]?.text || "لا يوجد رد";
    res.json({ text });
  } catch (e) {
    console.error(e.response?.data || e);
    res.status(500).json({ error: "API error" });
  }
}
