const toCamelCase = require("./string.utils");

const tableAsArray = function(stdout) {
  const header = stdout
    .split("\n")
    .splice(0, 1)[0]
    .replace(/(\t+|\ {2,})/gm, ";")
    .split(";")
    .map(column => toCamelCase(column));
  return stdout
    .split("\n")
    .splice(1)
    .filter(line => line.length > 0)
    .map(line => line.replace(/(\t+|\ {2,})/gm, ";"))
    .map(line => lineAsObject(line.split(";"), header));
};

function lineAsObject(cells, header) {
  const obj = {};
  for (let i = 0; i < cells.length; i++) {
    obj[header[i]] = cells[i];
  }
  return obj;
}

module.exports = tableAsArray;
