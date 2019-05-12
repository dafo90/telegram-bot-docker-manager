const { getDockerImages, getDockerContainers } = require("../utils/docker.api");

async function executeCheck() {
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
  return dockerImageNotUpAndRunning;
}

const onDockerStatus = async function() {
  const dockerImageNotUpAndRunning = await executeCheck();
  if (!dockerImageNotUpAndRunning || dockerImageNotUpAndRunning.length === 0) {
    return {
      error: false,
      response: "🐳 All Docker containers are up and running."
    };
  }
  const response =
    "️❗️*Problems detected* 🔧\n" +
    dockerImageNotUpAndRunning
      .map(({ repository, container }) =>
        container
          ? `${repository} - ${container.status} ❌`
          : `${repository} - not started ⚠️`
      )
      .join("\n");
  return { error: true, response, dockerImageNotUpAndRunning };
};

module.exports = onDockerStatus;
