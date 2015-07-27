#!/bin/sh -e
WEBPACK_CMD=node_modules/.bin/webpack

# Generate libs
rm -rf lib
rm -rf dist
mkdir -p dist
`npm bin`/babel src --out-dir lib

# Copy libs
$WEBPACK_CMD lib/index.js dist/sven.js
cp dist/sven.js examples/sven.js
