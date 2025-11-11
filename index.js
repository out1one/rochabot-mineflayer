const mineflayer = require('mineflayer');
const express = require('express');
const fetch = require('node-fetch');

const SERVER_HOST = 'rochachipamepija.aternos.me';
const SERVER_PORT = 15153;
const BOT_USERNAME = 'rochabot';

let bot;

function createBot() {
  console.log("Starting bot...");
  bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    version: false,
    auth: 'offline'
  });

  bot.on('login', () => {
    console.log("✅ Bot connected to server!");
    bot.chat("Hola! Soy un bot AFK 😊");
  });

  bot.on('spawn', () => {
    console.log("Bot spawned, enabling anti-AFK...");
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 300);
    }, 15000);
  });

  bot.on('death', () => {
    console.log("💀 Bot died, respawning...");
    setTimeout(() => bot.emit('respawn'), 5000);
  });

  bot.on('end', () => {
    console.log("❌ Disconnected, retrying in 10s...");
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => console.log("Bot error:", err.message));
}

// Wake Aternos periodically
setInterval(() => {
  fetch("https://" + SERVER_HOST)
    .then(() => console.log("🌐 Wake request sent to Aternos."))
    .catch(() => {});
}, 30000);

createBot();

// Express server keep-alive
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is running ✅");
});

app.get("/health", (req, res) => {
  res.json({ alive: true });
});

app.listen(PORT, () => console.log("✅ Express listening on PORT " + PORT));
