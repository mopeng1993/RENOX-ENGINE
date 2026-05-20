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

// 启动
bot.onText(/\/start/, (msg) => {

  bot.sendMessage(
    msg.chat.id,
    "🔥 RENOX ENGINE ONLINE 🔥\n\nSend a video to auto edit."
  );

});

// 风格列表（未来扩展）
bot.onText(/\/style/, (msg) => {

  bot.sendMessage(
    msg.chat.id,
    "🎬 Current Style:\n\nTikTok Fast Edit v1"
  );

});

// 收到视频
bot.on("video", async (msg) => {

  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "📥 Detecting video...");

  const fileId = msg.video.file_id;

  try {

    // 下载视频
    const filePath = await bot.downloadFile(
      fileId,
      "./downloads"
    );

    bot.sendMessage(chatId, "✅ Video downloaded.");

    // 输出文件
    const output = `./downloads/output_${Date.now()}.mp4`;

    bot.sendMessage(chatId, "🎬 Auto editing...");

    // ffmpeg command
    const command = `
ffmpeg -y -i "${filePath}" \
-vf "scale=-1:1280,crop=720:1280,setpts=0.8*PTS,fps=30" \
-af "atempo=1.1" \
-t 15 \
-preset veryfast \
"${output}"
`;

    // 执行 ffmpeg
    exec(command, async (error, stdout, stderr) => {

      if (error) {

        console.error("FFMPEG ERROR:", error);

        bot.sendMessage(
          chatId,
          `❌ Edit failed:\n${error.message}`
        );

        return;
      }

      console.log(stdout);
      console.log(stderr);

      bot.sendMessage(chatId, "📤 Uploading final edit...");

      // 发回视频
      await bot.sendVideo(chatId, output);

      bot.sendMessage(
        chatId,
        "✅ RENOX Edit Complete."
      );

    });

  } catch (err) {

    console.error("FULL ERROR:", err);

    bot.sendMessage(
      chatId,
      `❌ Error:\n${err.message}`
    );

  }

});
