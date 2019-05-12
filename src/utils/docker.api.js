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

module.exports = { getDockerImages, getDockerContainers };
