'use strict'

/**
 * Create the function to filter dependencies
 * @param  {Array} resolved Dependencies' name you wants,
 *                          Like [ 'script', 'link' ] in html,
 *                          Or [ 'background', 'src' ] in css
 * @return {Function}       Function to check if need, pass a name
 */
function makeResolved(resolved) {
  if (!resolved || resolved.length === 0) {
    return () => true
  }

  if (!Array.isArray(resolved)) {
    resolved = [ resolved ]
  }

  return (item) => resolved.indexOf(item) !== -1
}

module.exports = {
  makeResolved
}
