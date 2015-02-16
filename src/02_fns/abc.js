
/**
 * 获取对象长度
 */
function objLength(obj) {
  var j = 0;
  for ( i in obj ) {
    j++
  }
  return j;
}

/**
 * 检测是否在数组内
 */
function in_array(needle, haystack) {


    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(typeof haystack[i] == 'object') {
            if(arrayCompare(haystack[i], needle)) return true;
        } else {
            if(haystack[i] == needle) return true;
        }
    }
    return false;


}

function arrayCompare(a1, a2) {
  if (a1.length != a2.length) return false;
  var length = a2.length;
  for (var i = 0; i < length; i++) {
      if (a1[i] !== a2[i]) return false;
  }
  return true;
}


/**
 * 清除数组内指定元素
 */
function arrayClean(arr,deleteV) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == deleteV) {           
      arr.splice(i, 1);
      i--;  
    }
  } 
  return arr;
}

/**
 * 删除多维数组中的某个数组
 */

function deleteArr(bigarr,smallarr) {
  for (var i = 0; i < bigarr.length; i++) {
    if (arrayCompare(bigarr[i], smallarr)) {           
      bigarr.splice(i, 1);
      i--;  
    }
  } 
  return bigarr;
}

function cloneArray(arr) {
  return JSON.parse(JSON.stringify(arr))
}


/**
 * 获取obj的子对象数组
 */
function getKeys( obj ) {
  var ret = [];
  for ( var key in obj ) {
    if ( obj.hasOwnProperty(key) ) {
      ret.push( key );
    }
  }
  return ret;
};

/**
 * 遍历数组
 */
function forEach( array, iter ) {
  for ( var i = 0, l = array.length; i < l; i++ ) {
    var value = array[i];
    iter.call( this, value, i, array );
  }
};

/**
 * 二叉树对象转一维数组
 */
function obj2arr(obj) {
  var result = [];

  function re(obj, prev) {
    Object.keys(obj).forEach(function(item) {
      var hehe = [];
      if (obj[item] instanceof Object && !(obj[item] instanceof Array)) { // 不包含数组
      // if (obj[item] instanceof Object) { // 包含数组
        if (prev.length) {
          hehe = prev.concat()
        }
        hehe.push(item)
        result.push(hehe);
        re(obj[item], hehe);
      }
    });
  }

  re(obj, []);
  return result;
}

/**
 * 获取对象中的元素，并保存为数组
 */
function objElements (obj) {
  var result = [];

  function re(obj) {
    Object.keys(obj).forEach(function(item) {
      if (obj[item] instanceof Object && !(obj[item] instanceof Array)) { // 不包含数组
      // if (obj[item] instanceof Object) { // 包含数组

        result.push(item);
        re(obj[item]);
      }
    });
  }

  re(obj);
  return result;
}
