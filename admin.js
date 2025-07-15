const User = require("./models/userModel");

async function handleAdminCommands(ctx, bot) {
  const telegramId = ctx.from.id.toString();

  // Check if user is an admin
  const adminUser = await User.findOne({ telegramId, isAdmin: true });
  if (!adminUser) {
    return ctx.reply("🚫 You don't have permission to use admin commands.");
  }

  const command = ctx.message.text;

  // Broadcast command
  if (command.startsWith("/broadcast ")) {
    const message = command.replace("/broadcast ", "").trim();

    const users = await User.find({});
    let successCount = 0;

    for (const user of users) {
      try {
        await bot.telegram.sendMessage(user.telegramId, `📢 Broadcast:\n\n${message}`);
        successCount++;
      } catch (err) {
        console.log(`❌ Failed to send to ${user.telegramId}:`, err.message);
      }
    }

    return ctx.reply(`✅ Broadcast sent to ${successCount} users.`);
  }

  // Stats command
  if (command === "/stats") {
    const totalUsers = await User.countDocuments();
    return ctx.reply(`📊 Total registered users: ${totalUsers}`);
  }

  // List Users (optional)
  if (command === "/users") {
    const users = await User.find({});
    const userList = users.map((u) => `@${u.username || "N/A"} | ${u.wallet || "No Wallet"}`).join("\n");
    return ctx.reply(userList.length ? userList : "No users found.");
  }

  return ctx.reply("❓ Unknown admin command.");
}

module.exports = handleAdminCommands;
