const util = require("util");
const exec = util.promisify(require("child_process").exec);
const tableAsArray = require("../utils/stdout.parser");

async function getDockerImages() {
  const { stdout, stderr } = await exec("docker image ls");
  return tableAsArray(stdout);
}

async function getDockerContainers() {
  const { stdout, stderr } = await exec("docker ps");
  return tableAsArray(stdout);
}

async function startDockerContainer(containerId) {

}

async function restartDockerContainer(containerId) {
  const { stdout, stderr } = await exec(`docker restart ${containerId}`);
  return stdout; // Return the container ID
}

async function stopDockerContainer(containerId) {
}

async function updateDockerContainer(containerId) {
}

module.exports = { getDockerImages, getDockerContainers, restartDockerContainer };
