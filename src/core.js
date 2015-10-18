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
    origin: location.protocol+'//'+location.hostname+(location.port==''?'':(':'+location.port)),
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
      var filterPath = parsedUrl.pathname.substr(__app.conf.routeScope.length) || '/'
    }

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

}