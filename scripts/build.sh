#!/bin/sh -e
WEBPACK_CMD=node_modules/.bin/webpack

rm -rf lib
rm -rf dist
mkdir -p dist

`npm bin`/babel src --out-dir lib
$WEBPACK_CMD lib/index.js dist/sven.js
$WEBPACK_CMD examples/component/index.js examples/component/index.min.js