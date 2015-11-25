#!/bin/bash
NODE_ENV=development ../../node_modules/.bin/webpack-dev-server --devtool eval --progress --colors --hot --port 3001 --config webpack.config.js
