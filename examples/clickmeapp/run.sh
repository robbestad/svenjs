#!/bin/bash
NODE_ENV=development ../../node_modules/.bin/webpack-dev-server --devtool eval --progress --colors --hot --port 3000 --config webpack.config.dev.js
