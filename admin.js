const express = require("express");
const router = express.Router();
const ADMIN_ID = "7428947778"; // Your Telegram ID
const User = require("./models/User"); // Adjust path if needed

router.get("/admin", async (req, res) => {
  const requesterId = req.query.id;

  if (requesterId !== ADMIN_ID) {
    return res.status(403).send("Access denied. You're not the admin.");
  }

  try {
    const users = await User.find();
    let userList = `<h2>ZKDrop Bot Users (${users.length})</h2><ul>`;
    users.forEach((user) => {
      userList += `<li><strong>${user.first_name || "NoName"}</strong> - @${user.username || "N/A"} - ID: ${user.user_id}</li>`;
    });
    userList += "</ul>";
    res.send(userList);
  } catch (error) {
    res.status(500).send("Error fetching users.");
  }
});

module.exports = router;
