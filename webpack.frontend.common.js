/* eslint-disable import/no-extraneous-dependencies */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/frontend/index",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/frontend/index.html",
    }),
  ],
  output: {
    filename: "front.js",
    path: path.resolve(__dirname, "dist/static"),
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
  },
};
