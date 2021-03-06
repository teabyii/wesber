'use strict'

const path = require('path')

const cheerio = require('cheerio')
const shortHash = require('./hash').shortHash
const readFile = require('./readFile')
const detect = require('./detect')
const makeResolved = require('./option').makeResolved

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
 * @param  {String}   base HTML file path
 * @return {Object}        Dependency info, like: { file: 'foo.js', hash: '...' }
 */
function dealDependency($, elem, base) {
  const attr = elem.name === 'link' ?
    'href' : elem.name === 'object' ?
    'data' : 'src'

  elem = $(elem)

  let file = elem.attr(attr)

  if (!file) {
    return false
  }

  file = file.trim()
  const entireUri = detect.isEntireUri(file)
  const base64 = detect.isBase64(file)
  let p, hash, exists = false

  if (entireUri || base64) {
    p = null
    hash = '#' + shortHash(file)
  } else {
    p = path.resolve(path.dirname(base), file)
    hash = '#' + shortHash(p)
    exists = detect.isFile(p)
  }

  elem.attr(attr, hash)

  return {
    file,
    hash,
    entireUri,
    base64,
    exists,
    path: p
  }
}

/**
 * Parse html string to get dependencies
 * @param  {Function} $    Cheerio function
 * @param  {String}   base HTML file path
 * @return {Array}         Dependencies, like: [ dependency ... ]
 */
function parseHTML($, base, ok) {
  const result = []
  const tags = resourceTags.filter((tag) => ok(tag))

  $(tags.join(', ')).each((index, elem) => {
    result.push(dealDependency($, elem, base))
  })

  return result.filter((item) => item)
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
module.exports = function reHTML(file, options) {
  options = options || {} // default

  return readFile(file)
    .then((source) => {
      const $ = cheerio.load(source)
      const ok = makeResolved(options.resolved)

      const dependencies = parseHTML($, file, ok)
      const replacer = $.html()

      return { file, source, dependencies, replacer }
    })
}
