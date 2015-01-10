
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

function isEmpty(obj) {
  for (var name in obj) {
    return false;
  }
  return true;
}


/**
 * 获取当前时间戳，计算毫秒数
 */
function timestamp(arg) {
  if ( isUndefined(arg) ) {var arg = 0};
  return Date.now() - arg
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

  // simple=isDefined(simple)?simple:true;
  // var s = String.fromCharCode(2);
  // switch(simple){
  //   case true:
  //     var r = new RegExp(s+value+s);
  //     return (r.test(s+array.join(s)+s));
  //   case false:
  //     var result = false;
  //     var s = String.fromCharCode(2);
  //     for (var i = 0; i < array.length; i++) {
  //       if (value.join(s) == array[i].join(s)) {
  //         result = true
  //       }
  //     };
  //     return result;
  // }

  function arrayCompare(a1, a2) {
      if (a1.length != a2.length) return false;
      var length = a2.length;
      for (var i = 0; i < length; i++) {
          if (a1[i] !== a2[i]) return false;
      }
      return true;
  }

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
 * @param {__purple.eventLib} 
 * @param {__purple.eventLib.type} 触发方式，点击或者滑动
 * @param {__purple.eventLib.target} dom对象
 * @param {__purple.eventLib.target的值} 函数名
 */
function clearEvents(machine) {
  for (var i = 0; i < machine.eventArray.length; i++) {
    var a = machine.eventArray[i];
    $(a[0]).off(a[1],a[2],a[3])
  }
  
  machine.eventArray = [] // 清空事件集
}




/**
 * URL 解析
 * 2014-05-27 13:24:33

 source == origin+pathname+search+hash
 source == origin+relative
 source == protocol+hostname+port+relative

 search即从origin后的第一个?开始，到第一个#号之前
 hash从第一个#开始，一直到结束


 所以先判断hash，将href中的hash成分去除
 再判断search，只要看看还有没有?号即可
 剩下的就是origin+pathname了

 如果origin不是当前的origin，则用location.replace(source)进行跳转。

 */
function parseURL(url) {
  var a =  document.createElement('a');
  a.href = url;


  /**
   * IE下，a.pathname是不显示第一个字符'/'的，
   * 这会导致'/'这种url获取不到真实的pathname（会显示空字符）
   * 所以修正下，手动加上'/'
   */
  var ppx = a.pathname || '/'+ a.pathname

  var result = {
    href: a.href,
    origin: a.origin,
    source: url,
    protocol: a.protocol.replace(':',''),
    hostname: a.hostname,
    port: a.port,
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1], //  除去origin之外的全部

    /**
     * pathname字符串+一维数组
     */
    pathname: ppx.replace(/^([^\/])/,'/$1'),
    pathnames: arrayClean(a.pathname.replace(/^\//,'').split('/'),''),

    /**
     * search字符串+关联数组
     */
    search: a.search,
    searches: (function(){
      var ret = {},
        seg = a.search.replace(/^\?/,'').split('&'),
        len = seg.length, i = 0, s;
      for (;i<len;i++) {
        if (!seg[i]) { continue; }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    })(),

    /**
     * hash字符串+关联数组
     */
    hash: a.hash.replace('#',''),
    hashes: arrayClean(a.hash.replace(/^(#)*/i,'').replace(/^\//,'').split('/'),''),

    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
  }



  var parsedURL = String();
  parsedURL += '/'+result.pathnames.join('/')



  if(objLength(result.searches)>0){
    parsedURL += String('?');
    for (x in result.searches) {
      parsedURL += x + '='
      parsedURL += ('undefined' != typeof result.searches[x]) ? result.searches[x]: ''
      parsedURL += '&'
    };
    parsedURL = parsedURL.substring(0, parsedURL.length-1)
  }


  if (result.hashes.length>0) {
    parsedURL += '#'
    for (var i = 0; i < result.hashes.length; i++) {
      if (i<result.hashes.length-1) {
        parsedURL += result.hashes[i] + String('/')
      } else {
        parsedURL += result.hashes[i]
      }
    };
  };



  result.parsedURL = parsedURL

  return result
}