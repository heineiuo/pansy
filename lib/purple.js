/*! PURPLE.js v0.5.1-SNAPSHOT 2015-05-28 */
(function (global) {

  if ( typeof define === "function" && define.amd ) {
    define(function () {
      return factory(global)
    })
  } else {
    global.purple = factory(global)
  }

  function factory(global) {
;/**
 * __purple
 * @api private
 */
var __purple = {
  tree: {},
  template: {}, // html模板 string类型
  node: {}, // dom 对象
  app: {
    __anonymous: {}
  },
  conf: {
    mainApp: null,
    scope: 'body',
    scopeDOM: null,
    templateSource: 'script',
    filter: '/'
  }
};

/**
 * Create or return an App.
 *
 * @param {string} name
 * @returns {*}
 */
function purple (name) {

  // 如果没传入name，返回主app或者匿名app
  if (arguments.length === 0 ) {
    if (__purple.conf.mainApp !== null) {
      return __purple.app[__purple.conf.mainApp]
    } else {
      return __purple.app.__anonymous
    }

  // 否则，返回已建立的app，或者建立app
  } else {
    if (isDefined(__purple.app[name])) {
      return __purple.app[name]
    } else {
      return newApp(name)
    }
  }

  /**
   * @param {string} name
   * @returns {Object} app
   * @api private
   *
   */
  function newApp (name) {

    var app = __purple.app[name] = {

      name: name,

      // 中间件
      middleware: [],

      // 路由集合
      list: {},

      // 配置
      conf: {

      },

      /**
       * current url.
       */
      currentHref: null,

      /**
       * prev url.
       */
      prevHref: null,

      /**
       * Set app config.
       */
      set: function(name, conf){
          this.conf[name] = conf
      },

      /**
       * Get app config.
       * @param {string} name
       * @return {string|object}
       */
      get: function(name){
        return this.conf[name]
      },

      /**
       * Add middleware for app.
       * @param {function} fn
       * @api public
       */
      use: function (fn) {
        app.middleware.push(fn)
      },

      /**
       * Core method. Change the route state.
       * @param {string} href
       * @param {string} type
       * @api public
       */
      go: function(href, type){

        var req = parseURL(href)
        // 跳转是否结束
        req._end = false
        // 原始请求连接
        req.rawUrl = href 
        // 堆栈方式
        req.historyStateType = type || 'push'

        var res = {
          timestamp: Date.now(),

          isFirstRender: true,

          prevView: null,

          end: function () {
            req._end = true
            if(this.prevView != null) {
              this.prevView.remove()
            }
            console.log('路由跳转完毕...')
          },

          render: function(tree, animation) {
            render(this, tree, animation)
          }
        };

        // 使用中间件
        var fns = [findRoute].concat(app.middleware)
        next();

        /**
         * 查找路由器
         */
        function findRoute(req, res, next) {
          if (req.historyStateType == 'replace') {
            history.replaceState('data', 'title', req.parsedURL)
          } else {
            history.pushState('data', 'title', req.parsedURL)
          }
          console.log('正在解析地址：'+req.rawUrl)

          // 判断href是否合法
          // 判断href是否在list中
          for(key in app.list) {
            if (app.list[key].regexp.test(req.pathname)) {
              console.log('解析路由成功：'+app.list[key].regexp)
              fns = fns.concat(app.list[key].fns)
              return next()
            }
          }

          console.warn('无法解析的地址：' + req.pathname)
          // todo res.status = 404， 重构fns，插入renderError
          res.end()
        }

        function next () {
          if (!req._end) {
            if (fns.length > 0) {
              fns.shift()(req, res, next)
            } else {
              res.end()
            }
          }
        }

        
      },

      /**
       * History back.
       */
      back: function(){
        // 后退一步
        history.back()
      },

      /**
       * Define a router and output a `get` method.
       *
       * @param {string|regex|Array} rawHref
       * @returns {object}
       * @api public
       */
      route: function(rawHref) {
        // 判断href是否合法

        if (isArray(rawHref)) {
          var href = new RegExp('^\/'+rawHref.join('\/')+'\/$')
        } else if (isString(rawHref)) {
          var href = new RegExp('^'+rawHref+'$')
        } else if (isRegExp(rawHref)){
          var href = rawHref
        } else {
          // todo error handle
          return false
        }

        var appHref = app.list[href] = {
          regexp: href,
          get: function () {
            appHref.fns = Array.prototype.slice.call(arguments,0)
          }
        }

        return appHref
      }

    }

    return app
  }

}

/**
 * Return dom string.
 *
 * @param {string} name
 * @returns {string}
 */
purple.template = function(name){
  return __purple.template[name] || '<div></div>';
};


/**
 * Set config for __purple.conf
 * @param {string} name
 * @param {string|object} conf
 * @api public
 */
purple.set = function(name, conf){
  __purple.conf[name] = conf
};

/**
 * Get config from __purple.conf
 * @param name
 * @returns {*}
 */
purple.get = function(name){
  return __purple.conf[name]
};

/**
 * Where to create DOMs.
 * @returns {string}
 */
purple.scope = function(){
  return __purple.conf.scope
}

/**
 * @api public
 */
purple.start = function() {
  /**
   * Start after document loaded.
   */

  if (document.readyState == "complete"){
    start();
  } else {

    document.onreadystatechange = function () {
      if (document.readyState == "complete") {
        document.onreadystatechange = null;
        start();
      }
    };

  }

  /**
   * Start.
   *
   * @api private
   */
  function start(){
    /**
     * Read template form document.scripts[type="template"].
     */
    if (__purple.conf.templateSource == 'script') {

      var _len = document.scripts.length;
      for (var i = _len-1; i > -1; i--) {
        var s = document.scripts[i];
        if (s.type === 'text/template') {
          __purple.template[s.attributes.getNamedItem('data-name').value] = s.innerText
          s.remove()
        }
      }

    }


    console.log('系统启动成功...')

    purple().go(location.href)
    console.log('初始页加载成功...')

    window.addEventListener('popstate', eventPopstate, false)
    console.log('正在监听URL变化...')

    document.addEventListener('click', eventClickAnchor, false)
    console.log('正在监听链接点击...')

  }

  /**
   * Event handle for popstate changed.
   * @api private
   */
  function eventPopstate(){
    var href = location.href
    purple().go(href, 'replace')
  }

  /**
   * Event handle for click tag `A`.
   * @param {object} event
   * @api private
   */
  function eventClickAnchor(event) {
    var href = findClosestAnchorHref(event.target)
    if (href !== null) {
      event.preventDefault()
      purple().go(href)
    }

    /**
     * Find closest anchor href.
     * @param dom
     * @returns {dom}
     * @api private
     */
    function findClosestAnchorHref(dom) {
      var href = null;
      r(dom);
      return href;

      /**
       * R.
       * @param dom
       */
      function r(dom) {
        if (dom == null) {
          href = null
        } else if (dom.nodeName == 'A') {
          href = dom.href || null
        } else  {
          r(dom.parentNode)
        }
      }

    }

  }

};

;/**
 * 模板渲染
 */

purple.node = function (nodeName, stringDom) {

  if (isDefined(stringDom)) {
    var dom = __purple.node[nodeName] = string2dom(stringDom)
    dom.style.display = 'none';
  } else {
    var dom = __purple.node[nodeName] || null
  }

  return dom

};


function string2dom (stringDom) {
  var wrapper= document.createElement('div')
  wrapper.innerHTML = stringDom
  deleteChildTextNode(wrapper)
  return wrapper.firstChild

  function deleteChildTextNode (dom) {
    r(dom)
    return dom

    function r(dom) {
      if (dom.childNodes.length > 0) {
        for (var i = dom.childNodes.length-1; i > -1; i--) {
          if (dom.childNodes[i].nodeName != '#text') {
            // 心累了，不递归了
          } else {
            dom.childNodes[i].remove()
          }
        }
      }
    } // end r
  } // end deleteChildTextNode
}


function render(res, tree, animation) {
  // 清空旧的视图，如果已经清空，pass
  if (res.prevView == null){
    res.prevView = string2dom('<div style="position: absolute"></div>');
    for(var i=purple.scope().childNodes.length - 1; i> -1; i--){
      res.prevView.appendChild(purple.scope().childNodes[i]);
    }
    __purple.node = {}
  }
  var treeArr = obj2arr(tree);
  // 新建视图
  for(var i = 0; i<treeArr.length; i++){
    var thisNodeName = treeArr[i][treeArr[i].length - 1];
    // 判断是否已经存在，已经存在，pass
    if (purple.node(thisNodeName) == null) {
      var thisNode = purple.node(thisNodeName, __purple.template[thisNodeName]);
      // 查找父节点
      if (treeArr[i].length == 1) {
        var parentNode = purple.scope()
      } else {
        var parentNodeName = treeArr[i][treeArr[i].length - 2];
        var parentNode = purple.node(parentNodeName);
      }
      // 查找插口
      var jack = parentNode.querySelector('[data-id="'+thisNodeName+'"]');
      if (jack == null) {jack = parentNode}
      // 插入
      jack.appendChild(thisNode);
      if(isUndefined(animation)){
        thisNode.style.display = null;
      }
    }
  } // 遍历结束
  if(isDefined(animation)){
    animation(prevView, purple.scope())
  }
};purple.debug = function () {
  return __purple
}

;

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



function closest(child, target) {


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

    // pathname string
    pathname: ppx.replace(/^([^\/])/,'/$1'),

    // pathnames array
    pathnames: arrayClean(a.pathname.replace(/^\//,'').split('/'),''),

    // search string
    search: a.search,

    // searches  key-value
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
};purple.dom = function(dom){

  if (typeof dom.__enhanced != 'undefined') {
    return dom
  }

  /**
   * 初始化 transform
   */
  var styleTransform = dom.style.transform || dom.style['-webkit-transform'] || dom.style['-moz-transform'];
  var translate3d = {x: 0, y: 0, z: 0 };
  var scale = {x: 1, y: 1};
  var rotate3d = {x: 0, y: 0, z: 0, angle: 0};
  if (styleTransform != null && styleTransform != '') {

    styleTransform = styleTransform.toLowerCase();
    var a = styleTransform.match(/(?:translate3d).+?\)/);
    if (a != null) {
      var a1 = a[0].split(/translate3d/)[1].match(/\d+/g);
      translate3d = {x: Number(a1[0]), y: Number(a1[1]), z: Number(a1[2]) }
    }

    var b = styleTransform.match(/(?:scale).+?\)/);
    if (b != null) {
      var b1 = b[0].split(/scale/)[1].match(/\d+/g);
      scale = {x: Number(b1[0]), y: Number(b1[1])}
    }

    var c = styleTransform.match(/(?:rotate3d).+?\)/);
    if (c != null) {
      var c1 = c[0].split(/rotate3d/)[1].match(/\d+/g);
      rotate3d = {x: Number(c1[0]), y: Number(c1[1]), z: Number(c1[2]) , angle: Number(c1[3])};
    }
  }

  dom.__transform = {
    translate3d: translate3d,
    scale: scale,
    rotate3d: rotate3d
  };

  dom.transform = function (transform) {

    var value = [
      'translate3d(' + transform.translate3d.x + 'px, ' + transform.translate3d.y + 'px, 0)',
      'scale(' + transform.scale.x + ', ' + transform.scale.y + ')',
      'rotate3d('+ transform.rotate3d.x +','+ transform.rotate3d.y +','+ transform.rotate3d.z +','+  transform.rotate3d.angle + 'deg)'
    ];

    value = value.join(" ");
    this.style.webkitTransform = value;
    this.style.mozTransform = value;
    this.style.transform = value;

    this.__transform = transform;
    this.__transform.prev = {
      translate3d: JSON.parse(JSON.stringify(this.__transform.translate3d)),
      scale: JSON.parse(JSON.stringify(this.__transform.scale)),
      rotate3d: JSON.parse(JSON.stringify(this.__transform.rotate3d))
    };

    return this

  };


  dom.__enhanced = true;
  return dom

};;
  return purple


} // END factory

})(this);