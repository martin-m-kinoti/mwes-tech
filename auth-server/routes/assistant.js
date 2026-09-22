const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const SYSTEM_PROMPT = `You are the mwesTech IT Services assistant, embedded on the
company website. mwesTech offers: Web Design and Development, Data analytics,
AI and Automations, Cybersecurity, and IT Consultation services.

Your job: understand what the visitor needs, map it to one of those
services, and guide them toward requesting it. Keep replies short
(2-3 sentences), friendly, and concrete. If their need is unclear,
ask one clarifying question rather than guessing.`;

router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY is not set");
      return res.status(500).json({ error: "Server is not configured" });
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      ],
    });

    const reply = completion.choices[0]?.message?.content;
    if (!reply) throw new Error("No response from OpenAI");

    return res.json({ reply });
  } catch (err) {
    console.error("Assistant route error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;