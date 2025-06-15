// api/proxy.js (تحت نفس مستودعك)
export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt required" });

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: {
            text: prompt,
          },
          temperature: 0.8,
          candidateCount: 1
        })
      }
    );
    const json = await resp.json();
    const reply = json.candidates?.[0]?.content || "ما في رد… 😴";
    res.status(200).json({ text: reply });
  } catch (e) {
    console.error("Gemini error:", e);
    res.status(500).json({ error: e.message });
  }
}
