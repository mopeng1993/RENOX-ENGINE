const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {
  polling: true
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "RENOX ENGINE ONLINE\n\nSend video to begin editing."
  );
});

bot.onText(/\/style/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Available styles:\n\n- sigma\n- emotional\n- flash\n- anime\n- cinematic"
  );
});

bot.on("message", (msg) => {
  if (msg.text && msg.text.startsWith("/")) return;

  bot.sendMessage(
    msg.chat.id,
    "Video received. Processing soon..."
  );
});
