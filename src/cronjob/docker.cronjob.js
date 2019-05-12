const fs = require("fs");
const onDockerStatus = require("../ontext/docker.status");

const errorsFile = "./errors_db.json";

const startDockerCronjob = function(bot) {
  setInterval(() => {
    onDockerStatus().then(({ error, response, dockerImageNotUpAndRunning }) => {
      let errorDatabase = {};
      try {
        if (fs.existsSync(errorsFile)) {
          errorDatabase = JSON.parse(fs.readFileSync(errorsFile, "utf8"));
        }
      } catch (err) {
        console.error(err);
      }
      const sendMessage = hasToSendMessage(
        error,
        errorDatabase,
        dockerImageNotUpAndRunning
      );
      if (sendMessage) {
        process.env.CHAT_IDS.split(",").forEach(chatId => {
          bot.sendMessage(chatId, response, { parse_mode: "Markdown" });
        });
        try {
          fs.writeFileSync(
            errorsFile,
            JSON.stringify({
              ...errorDatabase,
              docker: dockerImageNotUpAndRunning
            }),
            "utf8"
          );
        } catch (err) {
          console.error(err);
        }
      }
    });
  }, 1000 * 60 * 5); // Each 5 min
};

function hasToSendMessage(error, errorDatabase, dockerImageNotUpAndRunning) {
  if (error) {
    return (
      !errorDatabase ||
      !errorDatabase.docker ||
      !compareArrayImageId(errorDatabase.docker, dockerImageNotUpAndRunning)
    );
  } else {
    return (
      errorDatabase && errorDatabase.docker && errorDatabase.docker.length > 0
    );
  }
}

function compareArrayImageId(arr1, arr2) {
  if (!arr1) {
    return !arr2;
  }
  if (!arr2) {
    return false;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].imageId !== arr2[i].imageId) {
      return false;
    }
  }
  return true;
}

module.exports = startDockerCronjob;
