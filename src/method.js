

function isDefined(arg)   { return typeof arg != 'undefined' }
function isUndefined(arg) { return typeof arg == 'undefined' }
function isFunction(arg)  { return typeof arg == 'function'  }
function isBoolean(arg)   { return typeof arg == 'boolean'   }
function isString(arg)    { return typeof arg == 'string'    }
function isNumber(arg)    { return /^\d+$/.test(arg)         }
function isArray(arg)     { return arg instanceof Array      }
function isRegExp(arg)    { return arg instanceof RegExp     }
function isDate(arg)      { return arg instanceof Date       }
function isObject(arg)    { return arg instanceof Object     }
function isNull(arg)      { return arg === null || arg === ''}
function isEmpty(obj)     { for (var name in obj) { return false;} return true;}




/**
 * cookie 操作
 */
function setCookie(name,value,days) {//cookie名，值，时间
  removeCookie(name)
  var Days = days || 30 //此 cookie 将被保存 30 天
  var expires  = new Date()    //new Date("December 31, 9998");
  expires.setTime(expires.getTime() + Days*24*60*60*1000)
  var path = '/'
  document.cookie = name + "="+ escape(value) + ";expires=" + expires.toGMTString()+';path='+path
}

function getCookie(name) {
  var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
  if(arr != null) return unescape(arr[2]); return null;
}

function removeCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval=getCookie(name);
  if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}




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




/**
 * 二叉树对象转一维数组
 */
function obj2arr(obj) {
  var arr = [];
  re(obj, []);
  return arr;

  function re(obj, prev) {
    Object.keys(obj).forEach(function(item) {
      var hehe = [];
      // if (obj[item] instanceof Object && !(obj[item] instanceof Array)) { // 不包含数组
      if (obj[item] instanceof Object) { // 包含数组
        if (prev.length) {
          hehe = prev.concat()
        }
        hehe.push(item)
        arr.push(hehe);
        re(obj[item], hehe);
      }
    });
  }

}








/**
 * 在父级元素中查找router，找得到返回routername，招不到返回false
 */
function getRouter(dom) {

  var p = getParent(dom);

  if (p.nodeName == 'HTML') {
    return false;
  }
  
  /**
   * 获取id
   */
  var pid = p.id

  if (pid!='' && isRouter(pid)) {
    /**
     * 返回router name
     */
    return pid.substring(5)
  }
  return getRouter(p)

  /**
   * 获取父级元素
   */
  function getParent(dom) {
    return dom.parentNode || dom.parentElement
  }

  /**
   * 检查是否是state
   */
  function isRouter(id) {
    return /state[a-z]+/.test(id)
  }

}






/**
 * 在父级元素中查找标签
 */
function getParentByTag(dom, nodename) {
  if (dom.nodeName == 'BODY') {
    return false;
  }

  if (dom.nodeName == nodename) {
    return p
  };

  var p = getParent(dom);
  return getParentByTag(p)

  /**
   * 获取父级元素
   */
  function getParent(dom) {
    return dom.parentNode || dom.parentElement
  }
}
