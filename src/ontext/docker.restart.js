const keyboardWrapper = require('node-telegram-keyboard-wrapper');
const { getDockerContainers, restartDockerContainer } = require('../utils/docker.api');

const onDockerRestart = async () => {
  const dockerContainers = await getDockerContainers();
  const filteredContainers = dockerContainers.filter(({ status }) => status.toLowerCase().startsWith('up'));
  if (filteredContainers.length > 0) {
    const ik = new keyboardWrapper.InlineKeyboard();
    ik.addRow({
      text: 'Restart all containers',
      callback_data: 'dockerrestart/all'
    });
    filteredContainers.forEach(({ image, containerId }) =>
      ik.addRow({
        text: `Restart ${image.split(':')[0]}`,
        callback_data: `dockerrestart/${containerId}`
      })
    );
    return {
      response: '️❔ Which Docker container would you like to restart?',
      options: ik.build()
    };
  }
  return { response: '⚠️ No Docker containers present.', options: undefined };
};

const onDockerRestartContainerCallbackQuery = async action => {
  const dockerContainers = await getDockerContainers();
  const filteredContainers = dockerContainers.filter(({ status }) => status.toLowerCase().startsWith('up'));
  const errorResponse = '❗️Unknown container, no Docker container restarted.';
  if (action == 'all') {
    if (filteredContainers.length === 0) {
      return errorResponse;
    }
    filteredContainers.forEach(async ({ containerId }) => {
      await restartDockerContainer(containerId);
    });
    return '🐳 All Docker containers have been restarted.';
  }
  const container = filteredContainers.find(({ containerId }) => containerId === action);
  const restartedContainerId = await restartDockerContainer(container.containerId);
  if (restartedContainerId.split('\n')[0] !== container.containerId) {
    return `❗️ An error has occurred during *${container.image.split(':')[0]}* restart.`;
  }
  return `🐳 *${container.image.split(':')[0]}* has been restarted.`;
};

module.exports = { onDockerRestart, onDockerRestartContainerCallbackQuery };
