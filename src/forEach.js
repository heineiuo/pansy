
/**map
 * forEach arr and callback(item, index)
 * @param arr
 * @param callback
 */
function forEach(arr, callback){
  var len = arr.length
  if (typeof callback != "function"){
    throw new TypeError()
  }
  for (var i = 0; i < len; i++) {
    if (i in arr) {
      callback.call(arguments[1], arr[i], i, arr)
    }
  }
}

module.exports = forEach