const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

// Bot & Admin Info
const bot = new Telegraf(process.env.BOT_TOKEN);
const adminId = "7428947778";

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch((err) => {
  console.error("❌ MongoDB error:", err);
});

// Start Command
bot.start(async (ctx) => {
  await ctx.reply(
    `👋 *Welcome to zkDrop Bot* — your Web3 Airdrop Radar 🛰️\n\nTo qualify for current and future airdrops:\n🔹 Follow our Twitter 👉 https://x.com/VickOnWeb3\n🔹 Submit your wallet address\n\n👇 Tap below to start:`,
    { parse_mode: "Markdown" }
  );
});

// Handle Wallet Submissions
bot.on("text", async (ctx) => {
  const text = ctx.message.text.trim();
  const walletRegex = /^0x[a-fA-F0-9]{40}$/;

  if (walletRegex.test(text)) {
    const existing = await User.findOne({ userId: ctx.from.id });
    if (existing) {
      existing.wallet = text;
      await existing.save();
    } else {
      await User.create({
        userId: ctx.from.id,
        username: ctx.from.username || "N/A",
        wallet: text,
      });
    }

    await ctx.reply("✅ Wallet received and saved! You're now eligible for airdrops.");
  } else {
    await ctx.reply("❗ That doesn't look like a valid wallet address. Please try again.");
  }
});

// Admin Broadcast
bot.command("broadcast", async (ctx) => {
  if (ctx.from.id.toString() !== adminId) return;

  const message = ctx.message.text.split(" ").slice(1).join(" ");
  if (!message) return ctx.reply("❗ Please enter a message to broadcast.");

  const users = await User.find({});
  let count = 0;

  for (const user of users) {
    try {
      await bot.telegram.sendMessage(user.userId, `📢 *Admin Broadcast:*\n${message}`, {
        parse_mode: "Markdown",
      });
      count++;
    } catch (err) {
      console.error(`Failed to message ${user.userId}:`, err.message);
    }
  }

  ctx.reply(`✅ Broadcast sent to ${count} users.`);
});

// Launch Bot
bot.launch().then(() => {
  console.log("🤖 zkDrop Bot is running...");
});
