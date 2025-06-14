// api/proxy.js
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt required" });

  try {
    const result = await google("gemini-1.5-pro", {
      prompt: prompt,
      // نُضيف دي الخيالية علشان يرد دايمًا بطريقة مضحكة
      system: "أجب بطريقة مضحكة جدًا 😆"
    });

    return res.status(200).json({ text: result.text });
  } catch (e) {
    console.error("Gemini proxy error:", e);
    return res.status(500).json({ error: e.message || "Unknown error" });
  }
}
