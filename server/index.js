import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch"; // node 18+ has fetch global, but keep compatibility
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // restrict origins in production

const API_KEY = process.env.PATEWAY_API_KEY;
const BASE_URL = (process.env.PATEWAY_BASE_URL || "").replace(/\/+$/, "");

if (!API_KEY || !BASE_URL) {
  console.error("Missing PATEWAY_API_KEY or PATEWAY_BASE_URL in environment.");
  process.exit(1);
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Missing message" });

    // Example payload - adapt to Pateway.ai spec
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful agronomy assistant." },
        { role: "user", content: message }
      ],
      max_tokens: 800
    };

    const endpoint = `${BASE_URL}/chat/completions`.replace(/\/+/g, "/").replace("https:/", "https://");

    const providerResp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const dataText = await providerResp.text();
    let parsed;
    try { parsed = JSON.parse(dataText); } catch(e) { parsed = dataText; }

    if (!providerResp.ok) {
      return res.status(providerResp.status).json({ error: parsed });
    }

    let reply = "";
    if (parsed && parsed.choices && parsed.choices[0] && parsed.choices[0].message) {
      reply = parsed.choices[0].message.content;
    } else if (parsed && parsed.output && Array.isArray(parsed.output) && parsed.output[0] && parsed.output[0].content) {
      reply = parsed.output[0].content;
    } else if (typeof parsed === "string") {
      reply = parsed;
    } else {
      reply = JSON.stringify(parsed);
    }

    res.json({ reply, raw: parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

app.get("/health", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy server running on http://localhost:${port}`));
