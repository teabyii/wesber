'use strict'

const crypto = require('crypto')

/**
 * Create hash of the string
 * @param  {String} string
 * @return {String}
 */
function makeHash(string) {
  const hash = crypto.createHash('sha256')

  hash.update(string)
  return hash.digest('hex')
}

/**
 * Create a short hash of the string
 * @param  {String} string
 * @param  {Number} len    Length of hash, default is 8
 * @return {String}        
 */
function shortHash(string, len = 8) {
  return makeHash(string).substr(0, len)
}

module.exports = {
  makeHash, shortHash
}
