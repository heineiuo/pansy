/*! PURPLE.js v0.7.0-alpha 2015-10-20 */
(function (global) {

  if ( typeof define === "function" && define.amd ) {
    define(function () {
      return factory()
    })
  } else {
    global.purple = factory()
  }

  function factory() {
;
/**
 * 获取被点击a标签的链接
 * @param event
 * @param callback
 */

function anchorClick(req, res, next){

  if (typeof this.disabled != 'undefined') return next()

  this.disabled = true

  if(!__app.conf.spa) return next()

  console.log('开启监听anchor点击')

  document.addEventListener('click', function (event){

    closestHref(event.target, function(err, href){
      console.warn(err)
      if (err) return false
      if (href.substr(0,1) == '#'){
        console.info('HASH_MODE')
      } else {
        event.preventDefault()
        console.info('获取成功,开始跳转')
        __app.app.go(href, 'push')
      }
    })

    /**
     * Find closest anchor href.
     * @param dom
     * @api private
     */
    function closestHref(dom, callback) {
      if (dom == document.body || dom == null) {
        callback('notfound')
      } else {
        if (dom.nodeName == 'A') {
          if (typeof dom.attributes.href == 'undefined') {
            callback('err')
          } else {
            callback(null, dom.attributes.href.value)
          }
        } else {
          closestHref(dom.parentNode, callback)
        }
      }
    }

  }, false)

  next()

}
;
/**
 * 监听浏览器的popstate change
 */
function popstateChange(req, res, next) {

  if (typeof this.disabled != 'undefined') return next()

  this.disabled = true

  if (!__app.conf.spa) return next()

  console.log('开启监听浏览器popstate状态')

  window.addEventListener('popstate', function (event){

    var curUrl = __app.state.curUrl
    var newUrl = location.href
    var curUrlParsed = parseurl(curUrl)
    var newUrlParsed = parseurl(newUrl)

    if (curUrlParsed.pathname == newUrlParsed.pathname && curUrlParsed.search == newUrlParsed.search) {
      console.log('HASH_CHNAGED')
    } else {
      __app.app.go(location.href)
    }

  }, false);

  next()
}
;
function errHandleChecker(fn){
  try{
    return fn.toString().match(/[A-Z0-9a-z,(\s]*\)/)[0].split(',').length == 4
  } catch(e){
    return false
  }
};

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
function parseurl(url) {
  var a =  document.createElement('a');
  a.href = url;

  /**
   * IE下，a.pathname是不显示第一个字符'/'的，
   * 这会导致'/'这种url获取不到真实的pathname（会显示空字符）
   * 所以修正下，手动加上'/'
   */
  var ppx = a.pathname || '/'+ a.pathname;

  var result = {
    rawUrl: a.href,
    href: a.href,
    origin: getOrigin(a),
    source: url,
    protocol: a.protocol.replace(':',''),
    hostname: a.hostname,
    port: a.port,

    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1], //  除去origin之外的全部

    // pathname string
    pathname: ppx.replace(/^([^\/])/,'/$1'),

    // pathnames array
    pathnames: clean(a.pathname.replace(/^\//,'').split('/'),''),


    // search string
    search: a.search,

    // searches  key-value
    query: (function(){
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
    hashes: clean(a.hash.replace(/^(#)*/i,'').replace(/^\//,'').split('/'),''),

    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1]
  };



  var parsedURL = '/' + result.pathnames.join('/');


  if(!isEmpty(result.searches)){
    parsedURL += String('?');
    for (var x in result.searches) {
      if (result.searches.hasOwnProperty(x)){
        parsedURL += x + '=';
        parsedURL += ('undefined' != typeof result.searches[x]) ? result.searches[x]: '';
        parsedURL += '&'
      }
    }
    parsedURL = parsedURL.substring(0, parsedURL.length-1)
  }


  if (result.hashes.length>0) {
    parsedURL += '#';
    for (var i = 0; i < result.hashes.length; i++) {
      if (i<result.hashes.length-1) {
        parsedURL += result.hashes[i] + String('/')
      } else {
        parsedURL += result.hashes[i]
      }
    }
  }

  result.params = result.pathnames
  result.parsedURL = parsedURL
  result.parsedUrl = parsedURL

  return result

  function getOrigin(a) {

    if (typeof a.origin != 'undefined') {
      return a.origin
    }

    var origin = a.protocol + '//' + a.hostname
    if (a.port == '') {
      return origin
    }

    if (a.port == '80' && a.protocol == 'http:') {
      return origin
    }

    if (a.port == '443' && a.protocol == 'https') {
      return origin
    }

    origin += ':'+ a.port

    return origin

  }
};
function routeChecker(req, path){

  try {
    return req.filterPath.match(path)[0] == req.filterPath
  } catch(e){
    return false
  }

};
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
 * check empty object
 * @param obj
 * @returns {boolean}
 */
function isEmpty(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false;
  }
  return true;
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
 * findout item's index in arr
 * @param arr
 * @param value
 * @param fromIndex
 * @returns {*}
 */
function indexOf(arr, value, fromIndex) {
  return arr.indexOf(value, fromIndex)
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
};
/**
 * Create or return an App.
 *
 * @param arg
 * @returns {*}
 */
var __app = {
  init: false
}

function purple() {

  if (__app.init) return __app.app

  // 配置
  __app.conf = {
    origin: location.origin || location.protocol+'//'+location.hostname+(location.port==''?'':(':'+location.port)),
    timeout: 60000, // 一分钟
    routeByQuery: false,
    routeQuery: 'route', //默认
    routeScope: '',
    spa: false
  }

  // 状态
  __app.state = {
    complete: true,
    prevUrl: null,
    curUrl: location.href,
    errorStack: null
  }

  // 中间件集合
  __app.stack = []


  // 返回app及接口
  __app.app = {}

  /**
   * Set app config.
   */
  __app.app.set = function(name, value) {
    __app.conf[name] = value
  }

  __app.app.get = function(name) {
    if (typeof name != 'undefined') {
      return __app.conf[name]
    }
    return __app.conf
  }

  /**
   * Add middleware for app.
   * @param path
   * @param fn
   * @api public
   */
  __app.app.use = function () {


    if (arguments.length == 1){

      // 注册普通中间件
      if ( typeof arguments[0] === 'function'){
        var middleware = {
          fn: arguments[0]
        }
        middleware.isErrorHandle = errHandleChecker(middleware.fn)
        __app.stack.push(middleware)

      // 注册模块
      } else if (arguments[0] instanceof Array) {

        var arr = arguments[0]

        map(arr, function(item, index){
          if (typeof item === 'function'){
            __app.app.use(item)
          } else if (item instanceof Array && item.length ==2) {
            __app.app.use(item[0], item[1])
          } else {
            console.warn('use参数有误')
          }
        })

      //注册模块
      } else if (arguments[0] instanceof Object) {

        if (arguments[0].__stack instanceof Array) {
          __app.app.use(arguments[0].__stack)
        } else {
          console.warn('use参数有误')
        }
      } else {
        console.warn('use参数有误')
      }
    } else if (arguments.length == 2 ) {

      var path = arguments[0]
      var middleware = {
        fn: arguments[1]
      }

      if (path instanceof Array) {
        path = new RegExp('(^'+path.join('$)|(^')+'$)')
      } else if (typeof path == 'string') {
        path = new RegExp('^'+path+'$')
      }

      if (!path instanceof RegExp) {
        console.error('route参数错误: '+path)
      }

      middleware.path = path
      middleware.isErrorHandle = errHandleChecker(middleware.fn)
      __app.stack.push(middleware)

    }

  }

  /**
   * Core method. Change the route state.
   * @param {string} href
   * @param {string} type
   * @api public
   */
  __app.app.go = function(rawUrl, type){

    if (!__app.state.complete) return false
    __app.state.complete = false


    /**
     * 解析url
     */
    var parsedUrl = parseurl(rawUrl)

    if (parsedUrl.origin != __app.conf.origin) {
      location.replace(rawUrl)
    }

    if (__app.conf.routeByQuery){
      var filterPath = parsedUrl.query[__app.conf.routeQuery] || '/'
    } else {
      if(parsedUrl.pathname.match(new RegExp('^'+__app.conf.routeScope))){
        var filterPath = parsedUrl.pathname.substr(__app.conf.routeScope.length) || '/'
      } else {
        var filterPath = '/'
      }
    }

    console.info('请求地址: '+filterPath)

    var t = setTimeout(function(){
      res.end()
      console.warn('超时')
    }, __app.conf.timeout)

    /**
     * 封装请求
     */
    var req = extend(parsedUrl, {
      routed: false,
      expire: Date.now() + __app.conf.timeout,
      conf: __app.conf,
      state: __app.state,
      filterPath: filterPath,
      rawUrl: rawUrl, // 原始请求连接
      historyStateType: type || 'push' // 堆栈方式,默认是push
    })

    /**
     * 封装响应处理
     */
    var res = {
      end: function () {
        __app.state.complete = true
        __app.state.errorStack = null
        clearTimeout(t)
        console.info('请求结束')

        if (__app.conf.spa){
          if (req.historyStateType == 'replace') {
            history.replaceState('data', 'title', req.parsedURL)
          } else {
            history.pushState('data', 'title', req.parsedURL)
          }
        }
      },

      redirect: function(href){
        this.end();
        __app.app.go(href, 'replace')
      }
    }

    /**
     * 流程控制
     */
    var index = -1;
    var next = function (err) {
      index ++

      // 错误堆栈
      if (typeof err != 'undefined'){
        if (!__app.state.errorStack){
          __app.state.errorStack = []
        }
        __app.state.errorStack.push(err)
      }

      // 检查指针
      if(index >= __app.stack.length) {
        // 错误检查
        if (__app.state.errorStack){
          console.error(__app.state.errorStack)
        }
        // 404 检查
        if (!req.routed){
          console.error('404 not found')
        }
        res.end()
      } else {
        // 检查失效层
        if (typeof __app.stack[index].disabled != 'undefined'){
          next()
        } else {
          // 检查路由
          if (typeof __app.stack[index].path != 'undefined') {
            if (!routeChecker(req, __app.stack[index].path)){
              // 不匹配
              next()
            } else {
              req.routed = true
              errCheck()
            }
          } else {
            errCheck()
          }
          // 区分错误处理层
          function errCheck(){
            if (__app.stack[index].isErrorHandle) {
              __app.stack[index].fn(__app.state.errorStack, req, res, next)
            } else {
              __app.stack[index].fn(req, res, next)
            }
          }
        }
      }
    }

    /**
     * 开始执行
     */
    next()

  }

  // 默认中间件
  __app.app.use(popstateChange)
  __app.app.use(anchorClick)
  // 初始化成功
  __app.init = true
  // 返回
  return __app.app

};
purple.Router = function(){

  var __stack = []

  return {
    __stack: __stack,
    use: function(fn){
      __stack.push(fn)
    },

    route: function(path){

      return {
        get: function(){
          var fns = Array.prototype.slice.call(arguments,0)
          map(fns, function(item, index){
            __stack.push([path, item])
          })
        }
      }
    }
  }
};
purple.Controller = function (){

  var __stack = {}

  return function (name, fn){

    var isStackExist = typeof __stack[name] != 'undefined'

    if (typeof fn === 'function'){
      if (isStackExist) console.warn('controller has exits, but this new controller will be registered: '+name)
      __stack[name] = fn
    } else if (!isStackExist){
      console.warn('controller lost fn param, but it still run: '+name)
      __stack[name] = function(req, res, next) {
        next()
      }
    }

    return __stack[name]

  }

};

  return purple;


} // END factory

})(this);