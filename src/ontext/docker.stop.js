const keyboardWrapper = require('node-telegram-keyboard-wrapper');
const { getDockerContainers, stopDockerContainer } = require('../utils/docker.api');

const onDockerStop = async () => {
  const dockerContainers = await getDockerContainers();
  const filteredContainers = dockerContainers.filter(({ status }) => status.toLowerCase().startsWith('up'));
  if (filteredContainers.length > 0) {
    const ik = new keyboardWrapper.InlineKeyboard();
    ik.addRow({
      text: 'Stop all containers',
      callback_data: 'dockerstop/all'
    });
    filteredContainers.forEach(({ image, containerId }) =>
      ik.addRow({
        text: `Stop ${image.split(':')[0]}`,
        callback_data: `dockerstop/${containerId}`
      })
    );
    return {
      response: '️❔ Which Docker container would you like to stop?',
      options: ik.build()
    };
  }
  return { response: '⚠️ No Docker containers present.', options: undefined };
};

const onDockerStopContainerCallbackQuery = async action => {
  const dockerContainers = await getDockerContainers();
  const filteredContainers = dockerContainers.filter(({ status }) => status.toLowerCase().startsWith('up'));
  const errorResponse = '❗️Unknown container, no Docker container stopped.';
  if (action == 'all') {
    if (filteredContainers.length === 0) {
      return errorResponse;
    }
    filteredContainers.forEach(async ({ containerId }) => {
      await stopDockerContainer(containerId);
    });
    return '🐳 All Docker containers have been stopped.';
  }
  const container = filteredContainers.find(({ containerId }) => containerId === action);
  const stoppedContainerId = await stopDockerContainer(container.containerId);
  if (stoppedContainerId.split('\n')[0] !== container.containerId) {
    return `❗️ An error has occurred during *${container.image.split(':')[0]}* stop.`;
  }
  return `🐳 *${container.image.split(':')[0]}* has been stopped.`;
};

module.exports = { onDockerStop, onDockerStopContainerCallbackQuery };
