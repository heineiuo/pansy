function isDefined(arg) {
  return typeof arg != 'undefined'
}

function isString(arg) {
  return typeof arg == 'string'
}

function isArray(arg) {
  return arg instanceof Array
}

function isRegExp(arg) {
  return arg instanceof RegExp
}

function isEmpty(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false;
  }
  return true;
}

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

function indexOf(arr, value, fromIndex) {
  return arr.indexOf(value, fromIndex)
}

function extend() {
  var result = {};
  var objs = Array.prototype.slice.call(arguments,0);
  objs.forEach(function(props, index){
    for(var prop in props) {
      if(props.hasOwnProperty(prop)) {
        result[prop] = props[prop]
      }
    }
  });
  return result;
};