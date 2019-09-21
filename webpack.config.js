const path = require('path');
const packageJson = require('./package.json');

const { name: projectName, main } = packageJson;

module.exports = {
  target: 'node',
  entry: `./${main}`,
  output: {
    path: path.resolve(__dirname, './build'),
    filename: `${projectName}.js`
  },
  mode: 'production'
};
