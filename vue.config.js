const path = require("path");

module.exports = {
  lintOnSave: false,

  chainWebpack(config) {
    config.resolve.alias.set("@/lib", path.resolve(__dirname, "..", "lib"));
  },
};
