const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKE
    "RENOX ENGINE ONLINE\n\nSend video to begin editing."
  );
});

bot.onText(/\/style/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Available styles:\n\n- sigma\n- emotional\n- flash\n- anime\n- cinematic"
  );
});

bot.
