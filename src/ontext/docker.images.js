const keyboardWrapper = require('node-telegram-keyboard-wrapper');
const { getDockerImages } = require('../utils/docker.api');

const onDockerImages = async () => {
  const dockerImages = await getDockerImages();
  const listOfDockerImages = dockerImages.map(({ repository, tag }) => `${repository} - ${tag}`).join('\n');
  const response =
    '️📃️ *Docker images*\n' +
    (listOfDockerImages && listOfDockerImages.length > 0 ? listOfDockerImages : 'No Docker images present');
  let options = {};
  if (listOfDockerImages && listOfDockerImages.length > 0) {
    const ik = new keyboardWrapper.InlineKeyboard();
    dockerImages.forEach(({ repository, imageId }) =>
      ik.addRow({
        text: `${repository} status`,
        callback_data: `dockerimages/${imageId}`
      })
    );
    options = ik.build();
  }
  return { response, options };
};

const onDockerImageCallbackQuery = async action => {
  const dockerImages = await getDockerImages();
  const image = dockerImages.find(({ imageId }) => imageId === action);
  return (
    `🐳 Image *${image.repository}*\n` +
    `Tag - ${image.tag}\n` +
    `Image ID - ${image.imageId}\n` +
    `Created - ${image.created}\n` +
    `Size - ${image.size}`
  );
};

module.exports = { onDockerImages, onDockerImageCallbackQuery };
