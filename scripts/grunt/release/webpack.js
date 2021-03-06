var path = require("path")
var webpack = require("webpack")
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    // 除.bin目录以外的目录
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(moduleName) {
    nodeModules[moduleName] = 'commonjs ' + moduleName;
  });


module.exports.indexJS = {
  cache: false,

  entry: {
    index: "./src/Pansy"
  },

  target: 'node',
  externals: nodeModules,

  output: {

    library: "pansy",
    libraryTarget: 'umd',
    path: './.grunt/',
    //publicPath: "dist/",
    filename: "pansy.js",
    //chunkFilename: "[chunkhash].js"
  }

}
