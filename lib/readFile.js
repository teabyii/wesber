'use strict'

const fs = require('fs')

/**
 * Read file, return the promise
 * @param  {String} file    target path
 * @param  {Object} options Same as second param of `fs.readFile`
 * @return {Promise}
 */
module.exports = function readFile(file, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, options, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.toString())
      }
    })
  })
}
