/**
 * @module core/version
 * @see module:svenjs
 * @author Sven A Robbestad <sven@robbestad.com>
 */
'use strict';

exports.version = ()=> {
  return process.env.npm_package_version;
};
