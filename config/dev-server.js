"use strict";

const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("./webpack.config.dev");

const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {
  stats: {
    colors: true
  },
  proxy: [{
    context: ['/auth/**'],
    target: 'http://localhost:4000'
  }]
});

server.listen(3000, "127.0.0.1", function() {
	console.log("Starting server on http://localhost:3000");
});