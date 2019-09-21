const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { tableAsArray } = require('../utils/stdout.parser');

const getDockerImages = async () => {
  const { stdout } = await exec('docker image ls');
  return tableAsArray(stdout);
};

const getDockerContainers = async () => {
  const { stdout } = await exec('docker ps -a');
  return tableAsArray(stdout);
};

const startDockerContainer = async containerId => {
  const { stdout } = await exec(`docker start ${containerId}`);
  return stdout; // Return the container ID
};

const restartDockerContainer = async containerId => {
  const { stdout } = await exec(`docker restart ${containerId}`);
  return stdout; // Return the container ID
};

const stopDockerContainer = async containerId => {
  const { stdout } = await exec(`docker stop ${containerId}`);
  return stdout; // Return the container ID
};

module.exports = {
  getDockerImages,
  getDockerContainers,
  startDockerContainer,
  restartDockerContainer,
  stopDockerContainer
};
