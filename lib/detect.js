'use strict'

const fs = require('fs')

const RE_BASE64 = /^data:image\/.+?;base64,/
const RE_ENTIRE = /^https?:\/\/.+?\/?/

/**
 * Detect a uri is base64 code or not
 * @param  {String}  uri
 * @return {Boolean}
 */
function isBase64(uri) {
  return RE_BASE64.test(uri)
}

/**
 * Detect a uri is entire uri, like https://github.com/ or not
 * @param  {String}  uri
 * @return {Boolean}
 */
function isEntireUri(uri) {
  return RE_ENTIRE.test(uri)
}

/**
 * Detect a full path uri is a file or not
 * @param  {String}  uri Full path of a file
 * @return {Boolean}
 */
function isFile(uri) {
  try {
    const stats = fs.statSync(uri)
    return stats.isFile()
  } catch(e) {
    return false
  }
}

module.exports = {
  isBase64, isEntireUri, isFile
}
