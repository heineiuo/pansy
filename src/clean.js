/**
 * Clean.
 * @param arr
 * @param del
 * @returns {Array}
 */

var forEach = require('./forEach')

function clean(arr, del) {
  var result = [];
  forEach(arr, function(value){
    if (value !== del){
      result.push(value)
    }
  });
  return result;
}

module.exports = clean