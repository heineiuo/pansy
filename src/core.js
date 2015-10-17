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

  var __purple = this

  // 配置
  __app.conf= {
    timeout: 45000,
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
    errorStack: []
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
    return __app.conf[name]
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
  __app.app.go = function(href, type){

    if (!__app.state.complete) return false
    __app.state.complete = false


    // 超时处理
    var t = setTimeout(function(){
      console.warn('超时')
      res.end()
    }, __app.conf.timeout)

    // 封装请求
    var req = extend(parseurl(href), {
      prevUrl: __app.state.curUrl,
      rawUrl: href, // 原始请求连接
      historyStateType: type || 'push' // 堆栈方式
    })

    // 封装响应处理
    var res = {
      end: function () {
        clearTimeout(t)
        __app.state.complete = true;
        console.log('路由跳转完毕。')
      },

      redirect: function(href){
        this.end();
        __app.go(href, 'replace')
      }
    }

    // 流程控制
    var next = function (err) {
      // 获取指针
      if(typeof err != 'undefined' && err != null){
        __app.conf.exceptionHandler(err, req, res, next)
      } else if (!__app.state.complete) {
        if (flow.length > 0) {
          flow.shift()(req, res, next)
        } else {
          res.end()
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

}