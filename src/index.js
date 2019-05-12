process.env.NTBA_FIX_319 = 1; // To prevent deprecated message

const dotenv = require("dotenv");
const TelegramBot = require("node-telegram-bot-api");

const startDockerCronjob = require("./cronjob/docker.cronjob");
const canAnswer = require("./validator/validate.chat");
const onHelp = require("./ontext/help");
const {
  onDockerImages,
  onDockerImageCallbackQuery
} = require("./ontext/docker.images");
const {
  onDockerContainers,
  onDockerContainerCallbackQuery
} = require("./ontext/docker.containers");
const onDockerStatus = require("./ontext/docker.status");
const {
  onDockerRestart,
  onDockerRestartContainerCallbackQuery
} = require("./ontext/docker.restart");
const {
  onDockerStart,
  onDockerStartContainerCallbackQuery
} = require("./ontext/docker.start");
const {
  onDockerStop,
  onDockerStopContainerCallbackQuery
} = require("./ontext/docker.stop");

dotenv.config();

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

startDockerCronjob(bot);

bot.onText(/^\/(start|help)/, msg => {
  onHelp(msg).then(response => {
    bot.sendMessage(msg.chat.id, response, { parse_mode: "Markdown" });
  });
});

bot.onText(/^\/dockerimages/, msg => {
  if (canAnswer(msg.chat)) {
    onDockerImages().then(({ response, options }) => {
      bot.sendMessage(msg.chat.id, response, {
        ...options,
        parse_mode: "Markdown"
      });
    });
  }
});

bot.onText(/^\/dockercontainers/, msg => {
  if (canAnswer(msg.chat)) {
    onDockerContainers().then(({ response, options }) => {
      bot.sendMessage(msg.chat.id, response, {
        ...options,
        parse_mode: "Markdown"
      });
    });
  }
});

bot.onText(/^\/dockerstatus/, msg => {
  if (canAnswer(msg.chat)) {
    onDockerStatus().then(({ response }) => {
      bot.sendMessage(msg.chat.id, response, { parse_mode: "Markdown" });
    });
  }
});

bot.onText(/^\/dockerrestart/, msg => {
  if (canAnswer(msg.chat)) {
    onDockerRestart().then(({ response, options }) => {
      bot.sendMessage(
        msg.chat.id,
        response,
        options
          ? {
              ...options,
              parse_mode: "Markdown"
            }
          : { parse_mode: "Markdown" }
      );
    });
  }
});

bot.onText(/^\/dockerstart/, msg => {
  if (canAnswer(msg.chat)) {
    onDockerStart().then(({ response, options }) => {
      bot.sendMessage(
        msg.chat.id,
        response,
        options
          ? {
              ...options,
              parse_mode: "Markdown"
            }
          : { parse_mode: "Markdown" }
      );
    });
  }
});

bot.onText(/^\/dockerstop/, msg => {
  if (canAnswer(msg.chat)) {
    onDockerStop().then(({ response, options }) => {
      bot.sendMessage(
        msg.chat.id,
        response,
        options
          ? {
              ...options,
              parse_mode: "Markdown"
            }
          : { parse_mode: "Markdown" }
      );
    });
  }
});

bot.on("callback_query", query => {
  if (canAnswer(query.message.chat)) {
    let callbackFunction;
    switch (query.data.split("/")[0]) {
      case "dockerimages":
        callbackFunction = onDockerImageCallbackQuery;
        break;
      case "dockercontainers":
        callbackFunction = onDockerContainerCallbackQuery;
        break;
      case "dockerrestart":
        callbackFunction = onDockerRestartContainerCallbackQuery;
        break;
      case "dockerstart":
        callbackFunction = onDockerStartContainerCallbackQuery;
        break;
      case "dockerstop":
        callbackFunction = onDockerStopContainerCallbackQuery;
        break;
      default:
        console.error(
          `query.data not known: ${query.data.split("/")[0]}, not processed`
        );
    }
    bot
      .answerCallbackQuery(query.id, { text: "📩 Action received" })
      .then(() => {
        callbackFunction(query.data.split("/")[1]).then(response => {
          bot.sendMessage(query.message.chat.id, response, {
            parse_mode: "Markdown"
          });
        });
      });
  }
});

bot.on("polling_error", err => console.log(err));
