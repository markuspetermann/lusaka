const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === "production"
    ? "/client/"
    : "/",

  outputDir: "../server/client",

  productionSourceMap: false,

  transpileDependencies: [
    'vuetify'
  ],
});
