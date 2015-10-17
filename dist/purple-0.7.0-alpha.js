/*! PURPLE.js v0.7.0-alpha 2015-10-17 */
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

function anchor(req, res, next){

  if (typeof this.disabled != 'undefined'){
    next()
  }

  this.disabled = true

  document.addEventListener('click', anchorClickHandle, false);

  function anchorClickHandle(event){
    getAnchorHref(event, function(err, href){
      if (err) {
        //console.log(err)
      } else {
        purple(conf.name).go(href)
      }
    })
  }

  function getAnchorHref(event, callback){

    var href = null;

    r(event.target);

    //console.log('getAnchorHref: '+href)

    if (href == null) {
      callback('HREF_NOT_FOUND')
    } else if (href.substr(0,1) == '#'){
      callback('HASH_MODE')
    } else {
      event.preventDefault();
      callback(null, href)
    }

    /**
     * Find closest anchor href.
     * @param dom
     * @api private
     */
    function r(dom) {
      if (dom != document.body && dom != null) {
        if (dom.nodeName == 'A') {
          if (typeof dom.attributes.href == 'undefined'){
            href = null
          } else {
            href = dom.attributes.href.value
          }
        } else {
          r(dom.parentNode)
        }
      }
    }


  }

}
;


function popstate(req, res, next) {

  if (typeof this.disabled != 'undefined'){
    next()
  }

  this.disabled = true

  window.addEventListener('popstate', popstateHandle, false);

  function popstateHandle(event){
    console.log('popstateHandle')
    checkPopChange(function(err){
      if (err) {
        //console.log(err)
      } else {
        purple(conf.name).go(location.href)
      }
    })
  }

  function checkPopChange(callback){
    var curUrl = purple().state.curUrl
    var newUrl = location.href

    var curUrlParsed = parseurl(curUrl)
    var newUrlParsed = parseurl(newUrl)

    if (curUrlParsed.pathname == newUrlParsed.pathname && curUrlParsed.search == newUrlParsed.search) {
      callback('HASH_CHNAGED')
    } else {
      callback(null)
    }
  }

}
;
;
function errHandleChecker(fn){
  try{
    return fn.toString().match(/[a-z,(\s]*\)/)[0].split(',').length == 4
  } catch(e){
    return false
  }
};
function initChecker(){


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
    origin: a.origin,
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
};
function routeChecker(req, path){




  /**
   * 查找路由器
   */
  function findRoute(req, res, next) {

    console.log('正在解析地址：'+req.rawUrl);

    /**
     * 不在filter范围内，跳转页面。
     */
    var routePath = req.parsedUrl
    var notfound = true
    var mathResult = routePath.match(_thisApp.conf.filter.pathname)
    if (mathResult){

      if (typeof _thisApp.conf.filter.search != 'undefined'){
        console.log('路由模式切换为使用searches参数:'+_thisApp.conf.filter.search)

        /**
         * 开启使用参数模式做跳转
         * 使用search做路由的前提是要满足pathname过滤规则
         */
        var search = _thisApp.conf.filter.search
        if (typeof req.searches[search] != 'undefined' && req.searches[search] != ''){
          routePath = req.searches[search]
        } else {
          routePath = '/'
        }
      } else {
        routePath = req.pathname.substr(Object(mathResult[0]).length)
      }

    } else {
      console.warn('routePath不符合pathname过滤规则，浏览器重定向到请求网址')
      location.replace(req.rawUrl)
    }

    console.log('过滤后的routePath: '+routePath)

    _thisApp.state.prevUrl = _thisApp.state.curUrl
    _thisApp.state.curUrl = req.parsedUrl

    if (_thisApp.state.spa){
      if (req.historyStateType == 'replace') {
        history.replaceState('data', 'title', req.parsedURL)
      } else  {
        history.pushState('data', 'title', req.parsedURL)
      }
    }

    // 判断href是否合法
    // 判断href是否在list中
    for(var key in _thisApp.list) {
      if (_thisApp.list.hasOwnProperty(key)) {
        if (_thisApp.list[key].regexp.test(routePath)) {
          console.log('解析路由成功：'+_thisApp.list[key].regexp);
          flow = flow.concat(_thisApp.middleware, _thisApp.list[key].fns);
          notfound = false
          return next()
        }
      }
    }

    if (notfound){
      console.warn('该地址无法解析：' + req.rawUrl);
      _thisApp.conf.notFoundHandle(req, res);
    }

  }

}
;
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

function purple () {

  if (__app.init) return __app.app

  // 配置
  __app.conf= {
    timeout: 60000, // 一分钟
    routeByQuery: false,
    routeQuery: null,
    routeScope: ''
  }

  // 状态
  __app.state = {
    spa: false,
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

      if ( typeof arguments[0] === 'function'){
        var fn = arguments[0]
        fn.isErrorHandle = errHandleChecker(fn)
        __app.stack.push(fn)
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
      var fn = arguments[1]

      if (path instanceof Array) {
        path = new RegExp('(^'+path.join('$)|(^')+'$)')
      } else if (typeof path == 'string') {
        path = new RegExp('^'+path+'$')
      }

      if (!path instanceof RegExp) {
        console.error('route参数错误: '+path)
      }

      fn.path = path
      fn.isErrorHandle = errHandleChecker(fn)
      __app.stack.push(fn)

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
     * 封装请求
     */
    var req = extend(parseurl(rawUrl), {
      routed: false,
      expire: Date.now() + __app.conf.timeout,
      conf: __app.conf,
      state: __app.state,
      rawUrl: rawUrl, // 原始请求连接
      historyStateType: type || 'push' // 堆栈方式,默认是push
    })

    /**
     * 封装响应处理
     */
    var res = {
      end: function () {
        __app.state.complete = true;
        __app.state.errorStack = null;
        console.log('路由跳转完毕。')
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

      // 错误栈
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
            if (!routeChecker(__app.stack[index].path)){
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
            if (typeof __app.stack[index].isErrorHandle != 'undefined') {
              __app.stack[index](__app.state.errorStack, req, res, next)
            } else {
              __app.stack[index](req, res, next)
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

  __app.init = true

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
      return __stack[name]
    }

    if (!isStackExist){
      console.warn('controller lost fn param, but it still run: '+name)
      __stack[name] = function(req, res, next) {
        next()
      }
    }

    return __stack[name]

  }

}
;

  return purple;


} // END factory

})(this);