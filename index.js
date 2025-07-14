const express = require("express");
const { Telegraf, Markup } = require("telegraf");
const mongoose = require("mongoose");

// ⛓ Connect to MongoDB
mongoose.connect("mongodb+srv://zkdrop:vickzk@cluster0.8e8bd2r.mongodb.net/zkusers?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

const app = express();
const bot = new Telegraf("7245698081:AAEmO94JiubbP0902sRD99iCONQCatzuQRE");

// ✅ Keep-alive route
app.get("/", (req, res) => {
  res.send("zkDrop Bot is alive! 🛰️");
});
app.listen(3000, () => {
  console.log("🌐 Keep-alive server running on port 3000");
});

// 🧠 Start Command
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

// 💳 Handle wallet submission
bot.action("submit_wallet", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("Please send your wallet address now 💼");
});

bot.on("text", async (ctx) => {
  const text = ctx.message.text;
if (text.startsWith("0x") && text.length === 42) {
  const User = require("./models/User");

  const existing = await User.findOne({ userId: ctx.from.id });
  if (!existing) {
    await User.create({
      userId: ctx.from.id,
      username: ctx.from.username,
      wallet: text,
    });
  }

  await ctx.reply("✅ Wallet received and saved! You're now eligible for airdrops.");
}
  } else {
    await ctx.reply("❗ That doesn't look like a valid wallet address. Please try again.");
  }
});

bot.launch().then(() => {
  console.log("🤖 zkDrop Bot is running...");
});
