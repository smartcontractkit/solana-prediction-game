const webpack = require("webpack")

module.exports = function override (config, env) {
  console.log('override loader fallbacks')
  config.resolve.fallback = {
      "fs": false,
      "tls": false,
      "net": false,
      "http": require.resolve("stream-http"),
      "https": false,
      "zlib": require.resolve("browserify-zlib") ,
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "crypto": require.resolve("crypto-browserify"),
      "os": require.resolve("os-browserify/browser"),
      buffer: require.resolve("buffer"),
  }
  
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
    }),
  ]
  
  return config
}