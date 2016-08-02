'use strict'

const path = require('path')
const css = require('css')
const shortHash = require('./hash').shortHash
const readFile = require('./readFile')
const detect = require('./detect')

// The properties which may take a uri as value
const resourceProperties = [
  'background',
  'src',
  'cursor',
  'content',
  'border-image',
  '-moz-border-image',
  '-webkit-border-image',
  '-o-border-image',
  'list-style',
  'list-style-image'
]

// Resolve url() to get the uri
const RE_URL = /url\((['"]?)\s*(.+?)\s*\1\)/i

/**
 * Parse css AST node to get dependencies.
 * @param  {Object} node CSS AST node from css module
 * @return {Array}       Dependencies, like: [ { file: 'foo.png', hash: '...' } ]
 */
function parseNode(node) {
  // CSS root?
  if (
    node.type === 'stylesheet' ||
    node.type === 'media' ||
    node.type === 'host'
  ) {
      return node[node.type].rules.reduce((all, rule) => {
        return all.concat(parseNode(rule))
      }, [])
  }

  // Rule includes several (property-key)s
  if (
    node.type === 'rule' ||
    node.type === 'font-face' ||
    node.type === 'keyframe'
  ) {
    return node.declarations.reduce((all, declaration) => {
      return all.concat(parseNode(declaration))
    }, [])
  }

  if (node.type === 'keyframes') {
    return node.keyframes.reduce((all, keyframe) => {
      return all.concat(parseNode(keyframe))
    }, [])
  }

  // Properties
  if (node.type === 'declaration') {
    if (resourceProperties.indexOf(node.property) !== -1) {
      const ma = node.value.match(RE_URL)

      if (ma === null) {
        return []
      }

      const file = ma[2]
      const hash = '#' + shortHash(file + new Date().getTime())

      node.value = node.value.replace(file, hash)

      return [ {
        file,
        hash,
        entireUri: detect.isEntireUri(file),
        base64: detect.isBase64(file)
      } ]
    }
  }

  // None
  return []
}

/**
 * reCSS
 * Parse the css file to get dependencies
 * And replace them by the hash string to mark
 * @param  {String}  file Full path of a css file
 * @return {Promise}      Promise to get dependencies' info, like:
 *                        {
 *                       	  file: 'foo.css',
 *                       	  source: ... , // source code
 *                       	  replacer: ... , // all dependencies replaced by hash
 *                       	  dependencies: [ { file: 'foo.png', hash: ... } ]
 *                        }
 */
module.exports = function reCSS(file) {
  return readFile(file)
    .then((source) => {
      const ast = css.parse(source)
      const dependencies = parseNode(ast)

      // For absolute path of the dependencies
      dependencies.forEach((item) => {
        if (item.entireUri || item.base64) {
          item.path = null
        } else {
          item.path = path.resolve(path.dirname(file), item.file)
        }
        item.exists = detect.isFile(item.path)
      })

      const replacer = css.stringify(ast)

      return { file, source, replacer, dependencies }
    }).catch((error) => {
      console.log(error)
    })
}
