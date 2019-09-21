const keyboardWrapper = require('node-telegram-keyboard-wrapper');
const { getDockerContainers, startDockerContainer } = require('../utils/docker.api');

const onDockerStart = async () => {
  const dockerContainers = await getDockerContainers();
  const filteredContainers = dockerContainers.filter(({ status }) => status.toLowerCase().startsWith('exited'));
  if (filteredContainers.length > 0) {
    const ik = new keyboardWrapper.InlineKeyboard();
    ik.addRow({
      text: 'Start all containers',
      callback_data: 'dockerstart/all'
    });
    filteredContainers.forEach(({ image, containerId }) =>
      ik.addRow({
        text: `Start ${image.split(':')[0]}`,
        callback_data: `dockerstart/${containerId}`
      })
    );
    return {
      response: '️❔ Which Docker container would you like to start?',
      options: ik.build()
    };
  }
  return { response: '⚠️ No Docker containers present.', options: undefined };
};

const onDockerStartContainerCallbackQuery = async action => {
  const dockerContainers = await getDockerContainers();
  const filteredContainers = dockerContainers.filter(({ status }) => status.toLowerCase().startsWith('exited'));
  const errorResponse = '❗️Unknown container, no Docker container started.';
  if (action == 'all') {
    if (filteredContainers.length === 0) {
      return errorResponse;
    }
    filteredContainers.forEach(async ({ containerId }) => {
      await startDockerContainer(containerId);
    });
    return '🐳 All Docker containers have been started.';
  }
  const container = filteredContainers.find(({ containerId }) => containerId === action);
  const startedContainerId = await startDockerContainer(container.containerId);
  if (startedContainerId.split('\n')[0] !== container.containerId) {
    return `❗️ An error has occurred during *${container.image.split(':')[0]}* start.`;
  }
  return `🐳 *${container.image.split(':')[0]}* has been started.`;
};

module.exports = { onDockerStart, onDockerStartContainerCallbackQuery };
