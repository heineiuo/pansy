/**
 * forEach arr and callback(item, index)
 * @param arr
 * @param fn
 */
function forEach(arr, fn){
  var len = arr.length
  if (typeof fn != "function"){
    throw new TypeError()
  }
  for (var i = 0; i < len; i++) {
    if (i in arr) {
      fn.call(arguments[1], arr[i], i, arr)
    }
  }
}

/**
 * map objects and callback(item, index)
 * @param obj
 * @param callback
 * @returns {{}}
 */
function map(obj, callback) {
  var result = {};
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof callback === 'function') {
        result[key] = callback.call(obj, obj[key], key, obj);
      }
    }
  }
  return result;
}

/**
 * Extend multi objects.
 * @returns {object}
 */
function extend() {
  var result = {};
  var objs = Array.prototype.slice.call(arguments,0);
  forEach(objs, function(props, index){
    for(var prop in props) {
      if(props.hasOwnProperty(prop)) {
        result[prop] = props[prop]
      }
    }
  });
  return result;
}

/**
 * Clean.
 * @param arr
 * @param del
 * @returns {Array}
 */
function clean(arr, del) {
  var result = [];
  forEach(arr, function(value){
    if (value !== del){
      result.push(value)
    }
  });
  return result;
}