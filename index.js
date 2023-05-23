require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN); //Create Bot Instance

// start command
bot.start((ctx) => {
  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("ℹ️ Help", "help"),
      Markup.button.url("📣 Join Channel", "https://t.me/botcodes123"),
    ],
    [
      Markup.button.url(
        "🔗 OSS",
        "https://github.com/Armanidrisi/lyrics-finder-bot"
      ),
    ],
  ]);

  ctx.replyWithMarkdown(
    "*👋 Hello! I'm a simple lyrics finder bot designed to help you find the lyrics to your favorite songs.\n\n Just provide me with the name of the song, and I'll do my best to fetch the lyrics for you.\n\n Feel free to ask me for lyrics anytime, and I'll be happy to assist you 😊!*",
    keyboard
  );
});

//Help callback
bot.action("help", (ctx) => {
  ctx.telegram.sendMessage(
    ctx.chat.id,
    `*Hello! I'm a simple lyrics finder bot designed to help you find the lyrics to your favorite songs.\n\nJust provide me with the name of the song, and I'll do my best to fetch the lyrics for you.\n\nSend Any Song Name For Get Lyrics!*`,
    {
      parse_mode: "markdown",
    }
  );
});

//for handle message for lyrics
bot.on("text", async (ctx) => {
  const song = encodeURIComponent(ctx.message.text);
  const API = process.env.API_URL + song;
  try {
    const response = await axios.get(API);
    if (response.data.error) {
      ctx.reply("*❌️ Song Not Found*", { parse_mode: "markdown" });
    } else {
      ctx.telegram.sendMessage(
        ctx.chat.id,
        `<b>🚀 Here Is Your Song Lyrics</b>\n\n<code>${response.data.lyrics}</code>`,
        {
          parse_mode: "HTML",
        }
      );
    }
  } catch (e) {
    ctx.reply("_❌️ There Was An Error While Processing Your Request_", {
      parse_mode: "markdown",
    });
    //console.log(e);
  }
});

bot.launch(); //start bot