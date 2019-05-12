const { getDockerImages, getDockerContainers } = require("../utils/docker.api");

const onDockerStatus = async function() {
  const dockerImages = await getDockerImages();
  const dockerContainers = await getDockerContainers();
  const dockerImageNotUpAndRunning = [];
  dockerImages.forEach(dockerImage => {
    const container = dockerContainers.find(({ image }) => {
      return image.split(":")[0] === dockerImage.repository;
    });
    if (!container) {
      dockerImageNotUpAndRunning.push(dockerImage);
    } else if (!container.status.toLowerCase().startsWith("up")) {
      dockerImage.containerObject = container;
      dockerImageNotUpAndRunning.push(dockerImage);
    }
  });
  if (!dockerImageNotUpAndRunning || dockerImageNotUpAndRunning.length === 0) {
    return "🐳 All Docker containers are up and running.";
  }
  let response = "️❗️*Problems detected* 🔧";
  dockerImageNotUpAndRunning.forEach(({ repository, container }) => {
    if (container) {
      response += `\n${repository} - ${container.status} ❌`;
    } else {
      response += `\n${repository} - not started ⚠️`;
    }
  });
  return response;
};

module.exports = onDockerStatus;
