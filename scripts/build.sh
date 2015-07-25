#!/bin/sh -e
WEBPACK_CMD=node_modules/.bin/webpack

# Generate libs
rm -rf lib
rm -rf dist
mkdir -p dist
`npm bin`/babel src --out-dir lib

# Copy libs
$WEBPACK_CMD lib/index.js dist/sven.js
rm examples/sven.js
cp dist/sven.js examples/sven.js

# For prod
$WEBPACK_CMD -p examples/component/src/index.js examples/component/dist/index.min.js
$WEBPACK_CMD -p examples/todomvc/src/index.js examples/todomvc/dist/index.min.js
$WEBPACK_CMD -p lib/index.js dist/sven.min.js