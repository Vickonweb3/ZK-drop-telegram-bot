const express = require("express");
const { Telegraf, Markup } = require("telegraf");
const mongoose = require("mongoose");
require("dotenv").config();

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

const app = express();
app.get("/", (req, res) => {
  res.send("zkDrop Bot is alive! 🛰️");
});
app.listen(3000, () => {
  console.log("🌐 Keep-alive server running on port 3000");
});

// ✅ Use bot token from .env
const bot = new Telegraf(process.env.BOT_TOKEN);

// ✅ Admin Panel (create `admin.js` for custom admin logic)
require("./admin")(bot);

// 🚀 Telegram Bot Commands
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
    // OPTIONAL: Save wallet to MongoDB here
  } else {
    await ctx.reply("❗ That doesn't look like a valid wallet address. Please try again.");
  }
});

// ✅ Start the bot
bot.launch().then(() => {
  console.log("🤖 zkDrop Bot is running...");
});
