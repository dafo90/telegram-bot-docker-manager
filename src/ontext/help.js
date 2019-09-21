const canAnswer = require('../validator/validate.chat');

const helpForRegisteredUser = () => {
  return (
    '/help or /start - Help menu\n' +
    '/dockerimages - List of Docker images\n' +
    '/dockercontainers - List of Docker containers\n' +
    '/dockerstatus - Execute an immediate check of all Docker containers to verify if they are up and running\n' +
    '/dockerrestart - Restart Docker container\n' +
    '/dockerstart - Start Docker container\n' +
    '/dockerstop - Stop Docker container'
  );
};

const helpForGuest = msg => {
  console.error('Guest request: ' + msg.from.first_name + ' ' + msg.from.last_name);
  return '⛔️ This bot is only for private purposes, there are no functionalities for guest users.';
};

module.exports = async msg => {
  if (canAnswer(msg.chat)) {
    return helpForRegisteredUser(msg);
  } else {
    return helpForGuest(msg);
  }
};
