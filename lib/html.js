'use strict'

const path = require('path')

const cheerio = require('cheerio')
const shortHash = require('./hash').shortHash
const readFile = require('./readFile')
const detect = require('./detect')

// Tags which require external resource
const resourceTags = [
  'script',
  'link', // href
  'img',
  'audio',
  'video',
  'iframe',
  'embed',
  'object', // data
]

/**
 * Get dependency uri from tag's attribute
 * @param  {Function} $    Cheerio function
 * @param  {Object}   elem Cheerio element
 * @return {Object}        Dependency info, like: { file: 'foo.js', hash: '...' }
 */
function dealDependency($, elem) {
  const attr = elem.name === 'link' ?
    'href' : elem.name === 'object' ?
    'data' : 'src'

  elem = $(elem)

  const file = elem.attr(attr).trim()
  const hash = '#' + shortHash(file + new Date().getTime())
  elem.attr(attr, hash)

  return {
    file,
    hash,
    entireUri: detect.isEntireUri(file),
    base64: detect.isBase64(file)
  }
}

/**
 * Parse html string to get dependencies
 * @param  {Function} $ Cheerio function
 * @return {Array}      Dependencies, like: [ dependency ... ]
 */
function parseHTML($) {
  const result = []

  $(resourceTags.join(', ')).each((index, elem) => {
    result.push(dealDependency($, elem))
  })

  return result
}

/**
 * reHTML
 * Parse the html file to get dependencies
 * And replace them by the hash string to mark
 * @param  {String}  file Full path of a html file
 * @return {Promise}      Promise to get dependencies' info, like:
 *                        {
 *                       	  file: 'foo.html',
 *                       	  source: ... , // source code
 *                       	  replacer: ... , // all dependencies replaced by hash
 *                       	  dependencies: [ { file: 'bar.js', hash: ... } ... ]
 *                        }
 */
module.exports = function reHTML(file) {
  return readFile(file)
    .then((source) => {
      const $ = cheerio.load(source)
      const dependencies = parseHTML($)

      dependencies.forEach((item) => {
        item.path = path.resolve(path.dirname(file), item.file)
        item.exists = detect.isFile(item.path)
      })

      const replacer = $.html()

      return { file, source, dependencies, replacer }
    })
    .catch((error) => {
      console.log(error)
    })
}
