const { getDockerImages, getDockerContainers } = require('../utils/docker.api');
const keyboardWrapper = require('node-telegram-keyboard-wrapper');

const isRunning = status => {
  return status && status.toLowerCase().startsWith('up');
};

const executeCheck = async () => {
  const dockerImages = await getDockerImages();
  const dockerContainers = await getDockerContainers();
  return dockerImages.map(dockerImage => {
    const container = dockerContainers.find(({ image }) => image.split(':')[0] === dockerImage.repository);
    const { repository: imageRepository, tag: imageTag, imageId, created: imageCreated, size: imageSize } = dockerImage;
    if (container) {
      const {
        image: containerImage,
        containerId,
        command: containerCommand,
        created: containerCreated,
        status: containerStatus,
        ports: containerPorts,
        names: containerNames
      } = container;
      return {
        upAndRunning: isRunning(container.status),
        imageRepository,
        imageTag,
        imageId,
        imageCreated,
        imageSize,
        containerImage,
        containerId,
        containerCommand,
        containerCreated,
        containerStatus,
        containerPorts,
        containerNames
      };
    } else {
      return {
        upAndRunning: false,
        imageRepository,
        imageTag,
        imageId,
        imageCreated,
        imageSize
      };
    }
  });
};

const onDockerStatus = async () => {
  const dockerStatusList = await executeCheck();
  const listOfDockerStatus = dockerStatusList
    .map(({ upAndRunning, imageRepository, containerStatus }) =>
      upAndRunning
        ? `✔️ _${imageRepository}_ - ${containerStatus}`
        : `❌ _${imageRepository}_ - ${containerStatus ? containerStatus : 'not started'}`
    )
    .join('\n');
  const response =
    '️📃️ *Docker status*\n' +
    (listOfDockerStatus && listOfDockerStatus.length > 0 ? listOfDockerStatus : 'No Docker images present');
  let options = {};
  if (listOfDockerStatus && listOfDockerStatus.length > 0) {
    const ik = new keyboardWrapper.InlineKeyboard();
    dockerStatusList.forEach(({ upAndRunning, imageRepository, imageId, containerId }) =>
      ik.addRow({
        text: `${imageRepository} status`,
        callback_data: `dockerstatus/${upAndRunning ? containerId : containerId ? containerId : imageId}`
      })
    );
    options = ik.build();
  }
  return { response, options };
};

const onDockerStatusCallbackQuery = async action => {
  const dockerStatusList = await executeCheck();
  const dockerStatus = dockerStatusList.find(({ upAndRunning, imageId, containerId }) =>
    upAndRunning ? containerId === action : containerId ? containerId === action : imageId === action
  );
  if (dockerStatus.upAndRunning || dockerStatus.containerId) {
    const ik = new keyboardWrapper.InlineKeyboard();
    const response =
      `🐳 *Container ${dockerStatus.containerImage}*\n` +
      `_Container ID_ - ${dockerStatus.containerId}\n` +
      `_Command_ - ${dockerStatus.containerCommand}\n` +
      `_Created_ - ${dockerStatus.containerCreated}\n` +
      `_Status_ - ${dockerStatus.containerStatus}\n` +
      `_Ports_ - ${dockerStatus.containerPorts}\n` +
      `_Names_ - ${dockerStatus.containerNames}`;
    if (dockerStatus.upAndRunning) {
      ik.addRow({
        text: 'Restart',
        callback_data: `dockerrestart/${dockerStatus.containerId}`
      });
      ik.addRow({
        text: 'Stop',
        callback_data: `dockerstop/${dockerStatus.containerId}`
      });
    } else {
      ik.addRow({
        text: 'Start',
        callback_data: `dockerstart/${dockerStatus.containerId}`
      });
    }
    const options = ik.build();
    return { response, options };
  } else {
    return (
      `🐳 *Image ${dockerStatus.imageRepository}*\n` +
      `_Tag_ - ${dockerStatus.imageTag}\n` +
      `_Image ID_ - ${dockerStatus.imageId}\n` +
      `_Created_ - ${dockerStatus.imageCreated}\n` +
      `_Size_ - ${dockerStatus.imageSize}`
    );
  }
};

module.exports = { onDockerStatus, onDockerStatusCallbackQuery };
