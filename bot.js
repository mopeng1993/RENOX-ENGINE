const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const { exec } = require("child_process");

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {
  polling: true
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "RENOX ENGINE ONLINE\n\nSend a video to begin editing."
  );
});

bot.on("video", async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Downloading video...");

  const fileId = msg.video.file_id;

  try {
    const filePath = await bot.downloadFile(fileId, "./downloads");

    bot.sendMessage(chatId, "Video downloaded.");

    const output = `./downloads/output_${Date.now()}.mp4`;

    const command = `
ffmpeg -i "${filePath}" -t 30 -vf "scale=720:1280" "${output}"
`;

    bot.sendMessage(chatId, "Editing video...");

    exec(command, async (error) => {
      if (error) {
        console.log(error);
        bot.sendMessage(chatId, "Editing failed.");
        return;
      }

      bot.sendMessage(chatId, "Sending final video...");

      await bot.sendVideo(chatId, output);

      bot.sendMessage(chatId, "Edit complete.");
    });

  } catch (err) {
    console.log(err);
    bot.sendMessage(chatId, "Error processing video.");
  }
});
