const path = require('path');

module.exports = {
  configureWebpack(config) {
    config.devtool = 'eval-source-map';
    config.output.devtoolModuleFilenameTemplate = (info) =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/');
  }
};