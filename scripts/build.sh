#!/bin/sh -e
WEBPACK_CMD=node_modules/.bin/webpack

rm -rf lib
rm -rf dist
mkdir -p dist

`npm bin`/babel src --out-dir lib
#cp examples/component/src/app.js examples/component/src/app2.js
$WEBPACK_CMD lib/index.js dist/sven.js
rm examples/component/src/sven.js
cp dist/sven.js examples/component/src/sven.js

$WEBPACK_CMD examples/component/src/index.js examples/component/index.js
$WEBPACK_CMD -p examples/component/src/index.js examples/component/index.min.js
$WEBPACK_CMD -p lib/index.js dist/sven.min.js