#!/bin/sh -e
WEBPACK_CMD=node_modules/.bin/webpack
DEV='sh ./scripts/build.sh'

# GENERATE SVENJS LIB
$DEV

echo
echo Generating dist build of SVENJS
echo
$WEBPACK_CMD -p build/index.jsx dist/sven.min.js

#cp dist/sven.min.js ../svenjs-npm/index.min.js
#cp dist/sven.js ../svenjs-npm/index.jsx
cp dist/sven.js assets/index.jsx

#cp dist/sven.js ~/Jottacloud/Work/opensource/vdom-benchmark-svenjs/node_modules/svenjs/index.jsx
#cp dist/sven.min.js ../svenjs-blueprint/node_modules/svenjs/index.min.js
#cp dist/sven.js ../svenjs-blueprint/node_modules/svenjs/index.jsx
#cp dist/sven.min.js ../svenjs-todomvc/node_modules/svenjs/index.min.js
#cp dist/sven.js ../svenjs-todomvc/node_modules/svenjs/index.jsx

#cp dist/sven.min.js ../map/node_modules/svenjs/index.min.js
#cp dist/sven.js ../map/node_modules/svenjs/index.jsx

## For prod
#echo
#echo Generating timetravel app
#echo
#$WEBPACK_CMD -p examples/timetravel/src/index.jsx examples/timetravel/dist/app.min.js
##$WEBPACK_CMD examples/todomvc/src/index.jsx examples/todomvc/dist/app.jsx
#
#echo
#echo Generating TodoMVC app
#echo
#$WEBPACK_CMD -p examples/todomvc/src/index.jsx examples/todomvc/dist/app.min.js
##$WEBPACK_CMD examples/main/src/index.jsx examples/main/dist/app.jsx
#
#echo
#echo Generating main app
#echo
#$WEBPACK_CMD -p examples/composable/src/index.jsx examples/composable/dist/app.min.js
#
