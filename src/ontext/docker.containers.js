const keyboardWrapper = require('node-telegram-keyboard-wrapper');
const { getDockerContainers } = require('../utils/docker.api');

const onDockerContainers = async () => {
  const dockerContainers = await getDockerContainers();
  const listOfDockerContainers = dockerContainers
    .map(({ image, status }) => `${image.split(':')[0]} - ${status}`)
    .join('\n');
  const response =
    '️📃️ *Docker containers*\n' +
    (listOfDockerContainers && listOfDockerContainers.length > 0
      ? listOfDockerContainers
      : 'No Docker containers present');
  let options = {};
  if (listOfDockerContainers && listOfDockerContainers.length > 0) {
    const ik = new keyboardWrapper.InlineKeyboard();
    dockerContainers.forEach(({ image, containerId }) =>
      ik.addRow({
        text: `${image.split(':')[0]} status`,
        callback_data: `dockercontainers/${containerId}`
      })
    );
    options = ik.build();
  }
  return { response, options };
};

const onDockerContainerCallbackQuery = async action => {
  const dockerContainers = await getDockerContainers();
  const container = dockerContainers.find(({ containerId }) => containerId === action);
  return (
    `🐳 Container *${container.image}*\n` +
    `Container ID - ${container.containerId}\n` +
    `Command - ${container.command}\n` +
    `Created - ${container.created}\n` +
    `Status - ${container.status}\n` +
    `Ports - ${container.ports}\n` +
    `Names - ${container.names}`
  );
};

module.exports = { onDockerContainers, onDockerContainerCallbackQuery };
