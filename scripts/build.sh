#!/bin/sh -e
WEBPACK_CMD=node_modules/.bin/webpack

# Generate libs
rm -rf build
rm -rf dist
mkdir -p dist
`npm bin`/babel src --out-dir build

# Copy libs
$WEBPACK_CMD build/index.jsx dist/sven.js
cp dist/sven.js examples/sven.js
