process.env.NTBA_FIX_319 = 1; // To prevent deprecated message

const dotenv = require("dotenv");
const TelegramBot = require("node-telegram-bot-api");

const canAnswer = require("./validator/validate.chat");
const onHelp = require("./ontext/help");
const onCheckDockers = require("./ontext/check.dockers");

dotenv.config();

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on("polling_error", err => console.log(err));

bot.onText(/^\/(start|help)/, msg => {
  onHelp(msg).then(response => {
    bot.sendMessage(msg.chat.id, response, { parse_mode: "Markdown" });
  });
});

bot.onText(/^\/dockerstatus/, msg => {
  if (canAnswer(msg.chat)) {
    onCheckDockers(msg).then(response => {
      bot.sendMessage(msg.chat.id, response, { parse_mode: "Markdown" });
    });
  }
});
