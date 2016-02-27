/**
 * Extend multi objects.
 * @returns {object}
 */

var forEach = require('./forEach')

function extend() {
  var result = {};
  var arg2arr = Array.prototype.slice.call(arguments,0);
  forEach(arg2arr, function(props, index){
    for(var prop in props) {
      if(props.hasOwnProperty(prop)) {
        result[prop] = props[prop]
      }
    }
  });
  return result;
}

module.exports = extend