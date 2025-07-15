// zkDrop Bot - Final Version with Admin Features const { Telegraf } = require("telegraf"); const mongoose = require("mongoose"); const connectDB = require("./db"); const fs = require("fs"); const { Parser } = require("json2csv"); require("dotenv").config();

const bot = new Telegraf("7245698081:AAEmO94JiubbP0902sRD99iCONQCatzuQRE"); const ADMIN_ID = "7428947778";

connectDB();

const userSchema = new mongoose.Schema({ userId: String, username: String, wallet: String, }); const User = mongoose.model("User", userSchema);

bot.start(async (ctx) => { await ctx.reply( 👋 *Welcome to zkDrop Bot* — your Web3 Airdrop Radar 🛰️\n\nTo qualify for current and future airdrops:\n🔹 Follow our Twitter 👉 https://x.com/VickOnWeb3\n🔹 Submit your wallet address\n\n👇 Tap below to start:, { parse_mode: "Markdown" } ); });

bot.on("text", async (ctx) => { const wallet = ctx.message.text.trim();

if (/^0x[a-fA-F0-9]{40}$/.test(wallet)) { const existing = await User.findOne({ userId: ctx.from.id });

if (existing) {
  existing.wallet = wallet;
  await existing.save();
  await ctx.reply("🔁 Wallet updated successfully.");
} else {
  const user = new User({
    userId: ctx.from.id,
    username: ctx.from.username || "No username",
    wallet: wallet,
  });
  await user.save();
  await ctx.reply("✅ Wallet received and saved! You're now eligible for airdrops.");
}

} else { await ctx.reply("❗ That doesn't look like a valid wallet address. Please try again."); } });

// Broadcast command (admin only) bot.command("broadcast", async (ctx) => { if (ctx.from.id.toString() !== ADMIN_ID) return;

const message = ctx.message.text.split(" ").slice(1).join(" "); if (!message) return ctx.reply("❗ Usage: /broadcast Your message here");

const users = await User.find(); for (const user of users) { try { await bot.telegram.sendMessage(user.userId, message); } catch (e) { console.error("Failed to send message to:", user.userId); } }

ctx.reply(✅ Broadcast sent to ${users.length} users.); });

// /stats command bot.command("stats", async (ctx) => { if (ctx.from.id.toString() !== ADMIN_ID) return;

const total = await User.countDocuments(); const withWallet = await User.countDocuments({ wallet: { $ne: null } }); const empty = total - withWallet;

ctx.reply(📊 Bot Stats:\n👥 Total Users: ${total}\n💼 Wallets Submitted: ${withWallet}\n❌ Empty Wallets: ${empty}); });

// /users command - download as CSV bot.command("users", async (ctx) => { if (ctx.from.id.toString() !== ADMIN_ID) return;

const users = await User.find(); const csvFields = ["userId", "username", "wallet"]; const parser = new Parser({ fields: csvFields }); const csv = parser.parse(users);

fs.writeFileSync("users.csv", csv); await ctx.replyWithDocument({ source: "users.csv", filename: "zkdrop_users.csv" }); });

bot.launch().then(() => { console.log("🤖 zkDrop Bot is running..."); });

  
