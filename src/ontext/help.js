const canAnswer = require("../validator/validate.chat");

const onHelp = async function(msg) {
  if (canAnswer(msg.chat)) {
    return helpForRegisteredUser(msg);
  } else {
    return helpForGuest(msg);
  }
};

function helpForRegisteredUser(msg) {
  return (
    "/help or /start - Help menu\n" +
    "/dockerstatus - Execute an immediate check of all Docker containers to verify if they are up and running"
  );
}

function helpForGuest(msg) {
  console.log(
    "Guest request: " + msg.from.first_name + " " + msg.from.last_name
  );
  return "This bot is for private purposes, there are no functions for guest users.";
}

module.exports = onHelp;
