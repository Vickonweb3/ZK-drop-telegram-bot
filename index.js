const express = require("express");
const { Telegraf, Markup } = require("telegraf");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

// 🛰️ Keep-alive route
app.get("/", (req, res) => {
  res.send("zkDrop Bot is alive! 🛰️");
});
app.listen(3000, () => {
  console.log("🌐 Server listening on port 3000");
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// ✅ Register Admin Panel
require("./admin")(bot);

// ✅ Telegram Bot Logic
bot.start((ctx) => {
  ctx.reply(
    `👋 *Welcome to zkDrop Bot* — your Web3 Airdrop Radar 🛰️

To qualify for current and future airdrops:

🔹 Follow our Twitter  
🔹 Submit your wallet address

👇 Tap below to start:`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [
          Markup.button.url("🧵 Follow Twitter", "https://x.com/VickOnWeb3"),
          Markup.button.callback("💳 Submit Wallet", "submit_wallet"),
        ],
      ]),
    }
  );
});

bot.action("submit_wallet", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("Please send your wallet address now 💼");
});

bot.on("text", async (ctx) => {
  const text = ctx.message.text;
  if (text.startsWith("0x") && text.length === 42) {
    await ctx.reply("✅ Wallet received! You're now eligible for airdrops.");
  } else {
    await ctx.reply("❗ That doesn't look like a valid wallet address. Please try again.");
  }
});

// ✅ Launch Bot
bot.launch().then(() => {
  console.log("🤖 zkDrop Bot is running...");
});
