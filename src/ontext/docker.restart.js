const keyboardWrapper = require("node-telegram-keyboard-wrapper");
const {
  getDockerContainers,
  restartDockerContainer
} = require("../utils/docker.api");

const onDockerRestart = async function() {
  const dockerContainers = await getDockerContainers();
  if (dockerContainers && dockerContainers.length > 0) {
    const ik = new keyboardWrapper.InlineKeyboard();
    ik.addRow({
      text: `Restart all containers`,
      callback_data: `dockerrestart/all`
    });
    dockerContainers.forEach(({ image, containerId }) =>
      ik.addRow({
        text: `Restart ${image.split(":")[0]}`,
        callback_data: `dockerrestart/${containerId}`
      })
    );
    return {
      response: "️❔ Which Docker container would you like to restart?",
      options: ik.build()
    };
  }
  return { response: "⚠️ No Docker containers present.", options: undefined };
};

const onDockerRestartContainerCallbackQuery = async function(action) {
  const dockerContainers = await getDockerContainers();
  const errorResponse = "❗️Unknown container, no Docker container restarted.";
  if (action == "all") {
    if (dockerContainers || dockerContainers.length === 0) {
      return errorResponse;
    }
    dockerContainers.forEach(async ({ containerId }) => {
      await restartDockerContainer(containerId);
    });
    return "🐳 All Docker containers have been restarted.";
  }
  const container = dockerContainers.find(({ containerId }) => {
    return containerId === action;
  });
  const restartedContainerId = await restartDockerContainer(
    container.containerId
  );
  if (restartedContainerId.split("\n")[0] !== container.containerId) {
    return `❗️ An error has occurred during the restart of Docker container *${
      container.image.split(":")[0]
    }*.`;
  }
  return `🐳 *${container.image.split(":")[0]}* has been restarted.`;
};

module.exports = { onDockerRestart, onDockerRestartContainerCallbackQuery };