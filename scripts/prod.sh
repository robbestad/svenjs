#!/bin/sh -e
WEBPACK_CMD=node_modules/.bin/webpack
DEV='sh ./scripts/build.sh'

# GENERATE SVENJS LIB
$DEV

echo Generating dist build of SVENJS
$WEBPACK_CMD -p lib/index.js dist/sven.min.js

# For prod
echo Generating timetravel app
$WEBPACK_CMD -p examples/timetravel/src/index.js examples/timetravel/dist/app.min.js
#$WEBPACK_CMD examples/todomvc/src/index.js examples/todomvc/dist/app.js

echo Generating TodoMVC app
$WEBPACK_CMD -p examples/todomvc/src/index.js examples/todomvc/dist/app.min.js
#$WEBPACK_CMD examples/main/src/index.js examples/main/dist/app.js

echo Generating main app
$WEBPACK_CMD -p examples/main/src/index.js examples/main/dist/app.min.js

