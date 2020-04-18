module.exports = {
  publicPath: process.env.NODE_ENV === "production"
    ? "/client/"
    : "/",

  outputDir: "../server/client",

  productionSourceMap: false,

  configureWebpack: {
    externals: {
      crypto: "crypto"
    }
  }
}
