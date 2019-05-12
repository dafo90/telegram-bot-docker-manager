const util = require("util");
const exec = util.promisify(require("child_process").exec);
const tableAsArray = require("../utils/stdout.parser");

async function getDockerImages() {
  const { stdout, stderr } = await exec("docker image ls");
  return tableAsArray(stdout);
}

async function getDockerContainers() {
  const { stdout, stderr } = await exec("docker ps -a");
  return tableAsArray(stdout);
}

async function startDockerContainer(containerId) {
  const { stdout, stderr } = await exec(`docker start ${containerId}`);
  return stdout; // Return the container ID
}

async function restartDockerContainer(containerId) {
  const { stdout, stderr } = await exec(`docker restart ${containerId}`);
  return stdout; // Return the container ID
}

async function stopDockerContainer(containerId) {
  const { stdout, stderr } = await exec(`docker stop ${containerId}`);
  return stdout; // Return the container ID
}

module.exports = {
  getDockerImages,
  getDockerContainers,
  startDockerContainer,
  restartDockerContainer,
  stopDockerContainer
};
