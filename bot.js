const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const { exec } = require("child_process");

const token = process.env.BOT_TOKEN;

// 自动创建 downloads 文件夹
if (!fs.existsSync("./downloads")) {
  fs.mkdirSync("./downloads");
}

const bot = new TelegramBot(token, {
  polling: true
});

// /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🔥 RENOX ENGINE ONLINE 🔥\n\nSend a video to begin editing."
  );
});

// /style
bot.onText(/\/style/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🎬 Available Styles:\n\n• sigma\n• emotional\n• flash\n• anime\n• cinematic"
  );
});

// 收到视频
bot.on("video", async (msg) => {

  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "📥 Downloading video...");

  const fileId = msg.video.file_id;

  try {

    // 下载视频
    const filePath = await bot.downloadFile(fileId, "./downloads");

    bot.sendMessage(chatId, "✅ Video downloaded.");

    // 输出文件
    const output = `./downloads/output_${Date.now()}.mp4`;

    // ffmpeg command
    const command = `
ffmpeg -y -i "${filePath}" \
-vf "scale=720:1280,setpts=0.8*PTS,fps=30" \
-af "atempo=1.1" \
-t 15 \
-preset veryfast \
"${output}"
`;

    bot.sendMessage(chatId, "🎬 Editing video...");

    // 执行 ffmpeg
    exec(command, async (error, stdout, stderr) => {

      if (error) {

        console.error("FFMPEG ERROR:", error);

        bot.sendMessage(
          chatId,
          `❌ Editing failed:\n${error.message}`
        );

        return;
      }

      console.log(stdout);
      console.log(stderr);

      bot.sendMessage(chatId, "📤 Sending final video...");

      // 发回视频
      await bot.sendVideo(chatId, output);

      bot.sendMessage(chatId, "✅ Edit complete.");

    });

  } catch (err) {

    console.error("FULL ERROR:", err);

    bot.sendMessage(
      chatId,
      `❌ Error:\n${err.message}`
    );

  }

});
