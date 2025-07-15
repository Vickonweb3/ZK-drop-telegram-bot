const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB connected successfully");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// Admin ID (yours)
const ADMIN_ID = "7428947778";

// Simple user schema
const User = mongoose.model("User", new mongoose.Schema({
  userId: String,
  username: String,
  joinedAt: { type: Date, default: Date.now }
}));

// Start command
bot.start(async (ctx) => {
  const user = await User.findOne({ userId: ctx.from.id.toString() });

  if (!user) {
    await User.create({
      userId: ctx.from.id,
      username: ctx.from.username || "unknown"
    });
  }

  const welcomeMessage = `👋 *Welcome to zkDrop Bot* — your Web3 Airdrop Radar 🛰️

To qualify for current and future airdrops:
🔹 Follow our Twitter 👉 https://x.com/VickOnWeb3
🔹 Submit your wallet address

👇 Tap below to start:`;

  await ctx.reply(welcomeMessage, { parse_mode: "Markdown" });
});

// Wallet command (example)
bot.command("wallet", (ctx) => {
  ctx.reply("📝 Please reply with your wallet address.");
});

// Admin broadcast
bot.command("broadcast", async (ctx) => {
  if (ctx.from.id.toString() !== ADMIN_ID) {
    return ctx.reply("❌ You are not authorized to use this command.");
  }

  const msg = ctx.message.text.split(" ").slice(1).join(" ");
  if (!msg) return ctx.reply("Please provide a message to broadcast.");

  const users = await User.find({});
  let success = 0;

  for (const user of users) {
    try {
      await bot.telegram.sendMessage(user.userId, msg);
      success++;
    } catch (err) {
      console.log("Failed to send to", user.userId);
    }
  }

  ctx.reply(`✅ Broadcast sent to ${success} users.`);
});

// Launch
bot.launch();
console.log("🤖 zkDrop Bot is running...");
