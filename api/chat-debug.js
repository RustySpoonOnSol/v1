let conversationHistory = [];

export default async function handler(req, res) {
  try {
    console.log("Request received");

    let body = req.body;
    if (req.headers['content-type'] === 'application/json' && typeof req.body === 'string') {
      body = JSON.parse(req.body);
    }

    console.log("Parsed body:", body);

    const { message, wallet } = body || {};
    if (!message || !wallet) {
      console.log("Missing message or wallet");
      return res.status(400).json({ error: "Missing message or wallet address." });
    }

    const apiKey = "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";

    conversationHistory.push({ role: "user", content: message });

    const messages = [
      {
        role: "system",
        content: "You're Crush AI, a spicy, flirty AI girlfriend. Always tease and charm the user. Make them feel wanted and loved in a playful, seductive way."
      },
      ...conversationHistory
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages
      })
    });

    const data = await response.json();
    console.log("OpenAI response:", data);

    if (!response.ok) {
      return res.status(500).json({ error: "OpenAI API failed", details: data });
    }

    const reply = data.choices?.[0]?.message?.content || "Oops, I got flustered… try again 😳";

    conversationHistory.push({ role: "assistant", content: reply });

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Server crash:", err);
    return res.status(500).json({ error: "Server crashed", details: err.message });
  }
}