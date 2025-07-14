const User = require("./models/User");

module.exports = (bot) => {
  const ADMIN_ID = "7428947778"; // Your Telegram ID

  bot.command("users", async (ctx) => {
    if (String(ctx.from.id) !== ADMIN_ID) return;

    const users = await User.find();
    if (users.length === 0) {
      return ctx.reply("❗ No users have submitted wallets yet.");
    }

    let message = `📦 *Submitted Wallets:*\n\n`;
    users.forEach((u, i) => {
      message += `${i + 1}. @${u.username || "N/A"} - ${u.wallet}\n`;
    });

    ctx.reply(message, { parse_mode: "Markdown" });
  });
};
