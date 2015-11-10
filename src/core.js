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

}