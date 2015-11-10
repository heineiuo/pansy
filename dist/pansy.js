/*! PURPLE.js v0.7.1 2015-11-10 13:07:26 UTC */
(function (global) {

  if ( typeof define === "function" && define.amd ) {
    define(function () {
      return factory()
    })
  } else {
    global.pansy = factory()
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

  console.info('监听anchor点击: 开启')

  document.addEventListener('click', function (event){
    closestHref(event.target)
    /**
     * Find closest anchor href.
     * @param dom
     * @api private
     */
    function closestHref(dom) {
      if (dom != document.body && dom != null) {
        if (dom.nodeName == 'A') {
          if (typeof dom.attributes.href != 'undefined') {
            hrefHandle(dom.attributes.href.value)
          }
          // 交出处理权
        } else {
          closestHref(dom.parentNode)
        }
      }
      // 结束递归, 交出处理权
    }

    function hrefHandle(value) {
      if (value.substr(0,1) != '#') {
        if (url(location.href).href == url(value).href) {
          if (__app.conf.protocol=='file:') {
            getRight(value)
          } else {
            event.preventDefault()
            console.info('相同url默认无操作,如有特殊需求请手动app.go()')
          }
        } else if(url(location.href).beforeHash() == url(value).beforeHash()) {
          if (url(value).hash == '') {
            getRight(value)
          } else {
            console.log('#2', location.href, value)
          }
        } else if ( url(location.href).origin() == url(value).origin()) {
          getRight(value)
        } else {
          console.log('#3', location.href, value)
        }

      }
    }

    // 拿到处理权,并跳转
    function getRight(value){
      event.preventDefault()
      console.info('开始解析:' + value)
      __app.app.go(value, 'push')
    }

  }, false)

  next()

};
/**
 * 监听浏览器的popstate change
 */
function popstateChange(req, res, next) {

  if (typeof this.disabled != 'undefined') return next()

  this.disabled = true

  if (!__app.conf.spa) return next()

  console.info('监听浏览器popstate状态: 开启')

  window.addEventListener('popstate', function (event){

    if (url(__app.state.curUrl).beforeHash() != url(location.href).beforeHash()){
      // 确认拿到处理权 (→_→ 比隔壁容易多了
      __app.app.go(location.href, 'replace')
    }
    // 交出处理权

  }, false);

  next()
};
(function(win, doc) {
  var head = doc.head,
    devnull = function() {},
    bundleIdCache = {},
    bundleResultCache = {},
    bundleCallbackQueue = {};


  /**
   * Subscribe to bundle load event.
   * @param {string[]} bundleIds - Bundle ids
   * @param {Function} callbackFn - The callback function
   */
  function subscribe(bundleIds, callbackFn) {
    // listify
    bundleIds = bundleIds.push ? bundleIds : [bundleIds];

    var depsNotFound = [],
      i = bundleIds.length,
      numWaiting = i,
      fn, bundleId, r, q;

    // define callback function
    fn = function(bundleId, pathsNotFound) {
      if (pathsNotFound.length) depsNotFound.push(bundleId);

      numWaiting -= 1;
      if (numWaiting === 0) callbackFn(depsNotFound);
    };

    // register callback
    while (i--) {
      bundleId = bundleIds[i];

      // execute callback if in result cache
      r = bundleResultCache[bundleId];
      if (r) {
        fn(bundleId, r);
        continue;
      }

      // add to callback queue
      q = bundleCallbackQueue[bundleId] = bundleCallbackQueue[bundleId] || [];
      q.push(fn);
    }
  }


  /**
   * Publish bundle load event.
   * @param {string} bundleId - Bundle id
   * @param {string[]} pathsNotFound - List of files not found
   */
  function publish(bundleId, pathsNotFound) {
    // exit if id isn't defined
    if (!bundleId) return;

    var q = bundleCallbackQueue[bundleId];

    // cache result
    bundleResultCache[bundleId] = pathsNotFound;

    // exit if queue is empty
    if (!q) return;

    // empty callback queue
    while (q.length) {
      q[0](bundleId, pathsNotFound);
      q.splice(0, 1);
    }
  }


  /**
   * Load individual JavaScript file.
   * @param {string} path - The file path
   * @param {Function} callbackFn - The callback function
   */
  function loadScript(path, callbackFn) {
    var s = doc.createElement('script');

    s.style = 'text/javascript';
    s.async = true;
    s.src = path;

    s.onload = s.onerror = function(ev) {
      // remove script
      s.parentNode.removeChild(s);

      // de-reference script
      s = null;

      // execute callback
      callbackFn(path, ev.type);
    };

    // add to document
    head.appendChild(s);
  }


  /**
   * Load multiple JavaScript files.
   * @param {string[]} paths - The file paths
   * @param {Function} callbackFn - The callback function
   */
  function loadScripts(paths, callbackFn) {
    // listify paths
    paths = paths.push ? paths : [paths];

    var i = paths.length, numWaiting = i, pathsNotFound = [], fn;

    // define callback function
    fn = function(path, result) {
      if (result === 'error') pathsNotFound.push(path);

      numWaiting -= 1;
      if (numWaiting === 0) callbackFn(pathsNotFound);
    };

    // load scripts
    while (i--) loadScript(paths[i], fn);
  }


  /**
   * Initiate script load and register bundle.
   * @param {(string|string[])} paths - The file paths
   * @param {(string|Function)} [arg1] - The bundleId or success callback
   * @param {Function} [arg2] - The success or fail callback
   * @param {Function} [arg3] - The fail callback
   */
  function loadjs(paths, arg1, arg2, arg3) {
    var bundleId, successFn, failFn;

    // bundleId
    if (arg1 && !arg1.call) bundleId = arg1;

    // successFn, failFn
    if (bundleId) successFn = arg2;
    else successFn = arg1;

    // failFn
    if (bundleId) failFn = arg3;
    else failFn = arg2;

    // throw error if bundle is already defined
    if (bundleId) {
      if (bundleId in bundleIdCache) {
        throw new Error("LoadJS: Bundle already defined");
      } else {
        bundleIdCache[bundleId] = true;
      }
    }

    // load scripts
    win.setTimeout(function() {
      loadScripts(paths, function(pathsNotFound) {
        if (pathsNotFound.length) (failFn || devnull)(pathsNotFound);
        else (successFn || devnull)();

        // publish bundle load event
        publish(bundleId, pathsNotFound);
      });
    }, 0);  // fires after window 'load' event
  }


  /**
   * Execute callbacks when dependencies have been satisfied.
   * @param {(string|string[])} deps - List of bundle ids
   * @param {Function} [successFn] - Success callback
   * @param {Function} [failFn] - Fail callback
   */
  loadjs.ready = function (deps, successFn, failFn) {
    // subscribe to bundle load event
    subscribe(deps, function(depsNotFound) {
      // execute callbacks
      if (depsNotFound.length) (failFn || devnull)(depsNotFound);
      else (successFn || devnull)();
    });

    return loadjs;
  };


  /**
   * Manually satisfy bundle dependencies.
   * @param {string} bundleId - The bundle id
   */
  loadjs.done = function done(bundleId) {
    publish(bundleId, []);
  };


  // export
  win.loadjs = loadjs;
})(global, document);;

function url(val){

  var a =  document.createElement('a');
  a.href = val;

  return {
    href: a.href,
    hash: a.hash,
    port: a.port,
    protocol: a.protocol,
    // functions
    pathname: pathname,
    params: params,
    query: query,
    origin: origin,
    beforeHash: beforeHash,

    all: function(){
      return {
        port: a.port,
        protocol: a.protocol,
        hostname: a.hostname,
        pathname: pathname(),
        params: params(),
        query: query(),
        origin: origin(),
      }
    }
  }

  function beforeHash(){
    return a.href.replace(/#.*/, '')
  }

  function pathname(){
    var ppx = a.pathname || '/'+ a.pathname; // fix IE bug.
    return ppx.replace(/^([^\/])/,'/$1')
  }

  function params(){
    return clean(a.pathname.replace(/^\//,'').split('/'),'')
  }

  function query(){
    var ret = {}
    var seg = a.search.replace(/^\?/,'').split('&')
    var len = seg.length
    for (var i=0; i<len; i++) {
      if (!seg[i]) continue
      var s = seg[i].split('=')
      ret[s[0]] = s[1]
    }
    return ret
  }

  function origin() {
    if (typeof a.origin != 'undefined') return a.origin
    // fix IE bug.
    var origin = a.protocol + '//' + a.hostname
    if (a.port == '') return origin
    if (a.port == '80' && a.protocol == 'http:') return origin
    if (a.port == '443' && a.protocol == 'https') return origin
    origin += ':'+ a.port
    return origin
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
;
function Router(){

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
function Controller(){

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
/**
 * Create or return an App.
 *
 * @param arg
 * @returns {*}
 */
var __app = {
  init: false
}


var pansy = function() {

  if (__app.init) return __app.app

  // 初始化

  // 配置
  __app.conf = {
    timeout: 60000, // 一分钟
    routeByQuery: false,
    routeQuery: 'route', //默认
    routeScope: '',
    spa: false,
    protocol: null
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

  __app.app.config = function(name, value){
    if (typeof value != 'undefined') {
      __app.conf[name] = value
    }
    return __app.conf[name].toString() || undefined
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
            console.warn(item)
          }
        })

      //注册模块
      } else if (arguments[0] instanceof Object) {

        if (arguments[0].__stack instanceof Array) {
          __app.app.use(arguments[0].__stack)
        } else {
          console.warn('use router 时参数有误')
        }
      } else {
        console.warn('use参数异常')
      }
    } else if (arguments.length == 2 ) {

      var path = arguments[0]

      if (path instanceof Array) {
        path = new RegExp('(^'+path.join('$)|(^')+'$)')
      } else if (typeof path == 'string') {
        path = new RegExp('^'+path+'$')
      }

      if (!path instanceof RegExp) {
        console.error('route参数错误: '+path)
      }

      __app.stack.push({
        fn: arguments[1],
        path: path,
        isErrorHandel: errHandleChecker(arguments[1])
      })

    }

  }

  /**
   * Router
   **/

  __app.app.route = function(path){
    return {
      get: function(){
        var fns = Array.prototype.slice.call(arguments,0)
        map(fns, function(fn, index){
          __app.app.use(path, fn)
        })
      }
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
    var parsedUrl = url(rawUrl).all()

    if (__app.conf.routeByQuery){
      console.log(parsedUrl.query)
      var filterPath = parsedUrl.query[__app.conf.routeQuery] || '/'
    } else {
      if(parsedUrl.pathname.match(new RegExp('^'+__app.conf.routeScope))){
        var filterPath = parsedUrl.pathname.substr(__app.conf.routeScope.length) || '/'
      } else {
        var filterPath = '/'
      }
      parsedUrl.params = clean(filterPath.replace(/^\//,'').split('/'),'')
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

    var end = false

    /**
     * 封装响应处理
     */
    var res = {
      end: function () {
        end = true
        __app.state.complete = true
        __app.state.errorStack = null
        clearTimeout(t)
        console.info('请求结束')

        if (__app.conf.spa && __app.conf.protocol != 'file:'){
          console.log('spa: '+ __app.conf.spa)
          if (req.historyStateType == 'replace') {
            history.replaceState('data', 'title', req.rawUrl)
          } else {
            history.pushState('data', 'title', req.rawUrl)
          }
        }
      },

      redirect: function(href) {
        res.end()
        console.log('请求跳转')
        __app.app.go(href, 'push')
      }
    }

    /**
     * 流程控制
     */
    var index = -1;
    var next = function (err) {

      if (end) return console.error('Run next() after red.end(), PLS check.')

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

  // 初始化

  __app.app.config('protocol', location.protocol)
  // 加载默认中间件
  __app.app.use(popstateChange)
  __app.app.use(anchorClick)
  __app.init = true

  // 初始化成功, 返回app
  return __app.app

}


pansy.Controller = Controller
pansy.Router = Router

global.require = function(){

  var list = Array.prototype.slice.call(arguments,0)
  return function(req, res ,next) {
    loadjs(list, function(){
      next()
    }, function(depsNotFound){
      //if (depsNotFound.indexOf('foo') > -1) {};  // foo failed
      //if (depsNotFound.indexOf('bar') > -1) {};  // bar failed
      //if (depsNotFound.indexOf('thunk') > -1) {};  // thunk failed
      next(depsNotFound)
    })
  }

}


function errHandleChecker(fn){
  try{
    return fn.toString().match(/[A-Z0-9a-z,(\s]*\)/)[0].split(',').length == 4
  } catch(e){
    return false
  }
}

function routeChecker(req, path){

  try {
    return req.filterPath.match(path)[0] == req.filterPath
  } catch(e){
    return false
  }

};

  return pansy;


} // END factory

})(this);