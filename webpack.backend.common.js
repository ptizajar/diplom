/* eslint-disable import/no-extraneous-dependencies */
const path = require("path");

module.exports = {
  entry: "./src/backend/server.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist/back"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["...", ".jsx", ".scss"],
    fallback: {
      async_hooks: false, // or require.resolve("some-empty-module")
    },
  },
};
