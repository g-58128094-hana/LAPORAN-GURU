const path = require('path');

/**
 * This function will receive the current webpack config 
 * and need return the final webpack config.
 * @param {import("webpack").Configuration} webpackConfig
 * @returns {import("webpack").Configuration}
 */
function modifyWebpackConfig(webpackConfig) {
  webpackConfig.resolve.alias = {
    ...webpackConfig.resolve.alias,
    // Add your alias here, for example:
    // Utilities: path.resolve(__dirname, '../src/utilities/'),
    // Templates: path.resolve(__dirname, '../src/templates/'),
  };

  return webpackConfig;
}

module.exports = modifyWebpackConfig;
