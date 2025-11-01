import express from "express";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json());

// ✅ তোমার বট ও Supabase তথ্য
const TELEGRAM_TOKEN = "8567175489:AAFuweDqmPKuccyPDZTJsjlpGKOKwL_c-RY";
const SUPABASE_URL = "https://lkgiroagchhoskhxbhej.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFub24iLCJpYXQiOjE3NjE5Njc1MTUsImV4cCI6MjA3NzU0MzUxNX0.kRH1BcxsQ17-fkuvOk3nrWtpVj-NEuI0Io9VM_w2PaQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Telegram webhook endpoint
app.post("/webhook", async (req, res) => {
  try {
    const msg = req.body.message;
    if (!msg) return res.sendStatus(200);

    const chatId = msg.chat.id;
    const text = msg.text || "";

    // Save user info to Supabase
    await supabase.from("users").insert({
      id: chatId,
      name: msg.from?.username || "unknown",
      joined_at: new Date().toISOString()
    });

    // Reply to user
    const reply = `👋 হাই ${msg.from.first_name}, তুমি বলেছো: ${text}`;
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: reply }),
    });

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

app.get("/", (req, res) => {
  res.send("🚀 Bot is running!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Bot running on port ${PORT}`));
